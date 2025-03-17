
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { User, Settings, LogOut, CreditCard, Heart, UserCheck } from 'lucide-react';

interface UserProfileProps {
  user: {
    name: string;
    role: string;
    avatar: string;
    balance?: string;
    investmentsCount?: number;
    achievements?: string[];
  };
}

const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <Avatar className="h-10 w-10">
            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
          </Avatar>
          <div className="space-y-0.5">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.role}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          <span>My Investments</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
          <Heart className="h-4 w-4" />
          <span>Watchlist</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
          <UserCheck className="h-4 w-4" />
          <span>Achievements</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-red-500 flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
