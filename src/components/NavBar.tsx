
import React from 'react';
import { Link } from 'react-router-dom';
import { MapIcon, AlertTriangleIcon, BarChartIcon, MenuIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const isMobile = useIsMobile();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-convoy-primary text-white">
            <MapIcon size={18} />
          </div>
          <span className="font-semibold text-lg text-convoy-text">ConvoyWise</span>
        </Link>

        {isMobile ? (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden"
            >
              {isMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
            </Button>
            
            {isMenuOpen && (
              <div className="absolute top-16 left-0 right-0 bg-white shadow-lg border-b border-gray-100 p-4 animate-slide-down">
                <nav className="flex flex-col space-y-3">
                  <NavLink to="/" icon={<MapIcon size={18} />} label="Route Planner" onClick={() => setIsMenuOpen(false)} />
                  <NavLink to="/risk-analysis" icon={<AlertTriangleIcon size={18} />} label="Risk Analysis" onClick={() => setIsMenuOpen(false)} />
                  <NavLink to="/dashboard" icon={<BarChartIcon size={18} />} label="Dashboard" onClick={() => setIsMenuOpen(false)} />
                </nav>
              </div>
            )}
          </>
        ) : (
          <nav className="flex items-center space-x-1">
            <NavLink to="/" icon={<MapIcon size={18} />} label="Route Planner" />
            <NavLink to="/risk-analysis" icon={<AlertTriangleIcon size={18} />} label="Risk Analysis" />
            <NavLink to="/dashboard" icon={<BarChartIcon size={18} />} label="Dashboard" />
          </nav>
        )}
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, label, onClick }) => {
  const isActive = window.location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
      ${isActive 
        ? 'bg-convoy-primary text-white' 
        : 'text-convoy-text hover:bg-gray-100'}`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default NavBar;
