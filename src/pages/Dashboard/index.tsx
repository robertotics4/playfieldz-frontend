import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "../../components/ui/Skeleton";
import { Avatar } from "../../components/ui/Avatar";
import { Card } from "../../components/ui/Card";
import { CardHeader } from "../../components/ui/CardHeader";
import { CardTitle } from "../../components/ui/CardTitle";
import { CardContent } from "../../components/ui/CardContent";

interface Player {
  _id: string;
  nickname: string;
  age: number;
  position: string;
}

interface PlayerSubscription {
  player: Player;
  paymentRecurrence: string;
}

interface Group {
  _id: string;
  name: string;
  createdBy: {
    _id: string;
    name: string;
  };
  playerSubscriptions: PlayerSubscription[];
  description?: string;
}

interface Role {
  groupId: string;
  permission: string;
}

interface User {
  _id: string;
  name: string;
  phone: string;
  roles: Role[];
  player: {
    _id: string;
    nickname: string;
    age: number;
    position: string;
    userId: string;
    attributes: { name: string; value: number }[];
  };
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('playfieldz:token');

        if (!token) {
          console.error("Token não encontrado");
          return;
        }

        const response = await axios.get<User>("http://localhost:3000/users/info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);

        const groupIds = response.data?.roles.map(role => role.groupId);
        if (groupIds && groupIds.length > 0) {
          const groupPromises = groupIds.map(async (groupId) => {
            const groupResponse = await axios.get<Group>(
              `http://localhost:3000/groups?_id=${groupId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            return groupResponse.data;
          });

          const fetchedGroups = await Promise.all(groupPromises);

          const uniqueGroups = filterAndPrioritizeGroups(fetchedGroups.flat(), response.data.roles);
          setGroups(uniqueGroups);
        }
      } catch (error) {
        console.error("Erro ao buscar informações do usuário", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);


  const filterAndPrioritizeGroups = (fetchedGroups: Group[], roles: Role[]) => {
    const groupMap: { [key: string]: Group } = {};

    fetchedGroups.forEach(group => {
      const role = roles.find(role => role.groupId === group._id);

      if (role) {
        if (role.permission === "admin") {
          groupMap[group._id] = group;
        } else if (!groupMap[group._id]) {
          groupMap[group._id] = group;
        }
      }
    });

    return Object.values(groupMap);
  };

  if (loading) {
    return (
      <div className="grid gap-4 p-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Informações do Usuário</h2>
      <div className="mb-4 flex items-center gap-4">
        <Avatar className="h-16 w-16 bg-gray-200">
          <span className="text-2xl">⚽</span>
        </Avatar>
        <div>
          <p className="text-xl font-semibold">{user?.name}</p>
          <p className="text-sm text-gray-600">{user?.phone}</p>
          <p className="text-sm text-gray-600">Posição: {user?.player?.position}</p>
          <p className="text-sm text-gray-600">Idade: {user?.player?.age}</p>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4">Grupos</h3>
      <div className="grid gap-4">
        {groups.map((group) => (
          <Card key={group._id} className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Avatar className="h-10 w-10 bg-gray-200">
                  <span className="text-xl">⚽</span>
                </Avatar>
                {group.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{group.description || "Sem descrição"}</p>
              <p className="text-sm text-gray-500 mt-2">
                Criado por: <span className="font-medium">{group.createdBy.name}</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Jogadores: {group.playerSubscriptions?.length || 0}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
