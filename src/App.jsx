import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Timeline from "./components/Timeline";
import { getSession, clearSession } from "./api/users";
import { 
  FiHome, 
  FiUsers, 
  FiCalendar, 
  FiMessageSquare, 
  FiBook, 
  FiTruck, 
  FiFileText, 
  FiLogOut,
  FiUser,
  FiSettings,
  FiBookOpen,
  FiClock,
  FiDollarSign,
  FiMenu,
  FiX
} from "react-icons/fi";

// Styled Components
const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background: var(--secondary-50);
`;

const Sidebar = styled.div`
  width: ${props => props.collapsed ? '80px' : '280px'};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-xl);

  @media (max-width: 768px) {
    width: ${props => props.mobileOpen ? '280px' : '0'};
    transform: translateX(${props => props.mobileOpen ? '0' : '-100%'});
  }
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
`;

const LogoText = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  opacity: ${props => props.collapsed ? '0' : '1'};
  transition: opacity 0.3s ease;
`;

const CollapseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1001;
  background: var(--primary-500);
  border: none;
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-lg);

  @media (max-width: 768px) {
    display: flex;
  }
`;

const SidebarNav = styled.nav`
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
`;

const NavSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 1.5rem 0.75rem;
  opacity: ${props => props.collapsed ? '0' : '1'};
  transition: opacity 0.3s ease;
`;

const MenuItem = styled.button`
  width: 100%;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.15)' : 'transparent'};
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: white;
    opacity: ${props => props.active ? '1' : '0'};
    transition: opacity 0.2s ease;
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  span {
    opacity: ${props => props.collapsed ? '0' : '1'};
    transition: opacity 0.3s ease;
    white-space: nowrap;
  }
`;

const UserSection = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  flex: 1;
  opacity: ${props => props.collapsed ? '0' : '1'};
  transition: opacity 0.3s ease;
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
`;

const UserRole = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: capitalize;
`;

const Content = styled.div`
  margin-left: ${props => props.sidebarCollapsed ? '80px' : '280px'};
  flex: 1;
  overflow-y: auto;
  transition: margin-left 0.3s ease;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const Overlay = styled.div`
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;

  @media (max-width: 768px) {
    display: ${props => props.show ? 'block' : 'none'};
  }
`;

// Navigation items by role
const getNavigationItems = (role) => {
  const commonItems = [
    { icon: FiHome, label: "Dashboard", path: "/dashboard", section: "Main" },
  ];

  const roleSpecificItems = {
    admin: [
      { icon: FiUsers, label: "Class Management", path: "/admin/my-classes", section: "Management" },
      { icon: FiCalendar, label: "Schedule", path: "/timetable", section: "Management" },
      { icon: FiMessageSquare, label: "Messages", path: "/admin/messages", section: "Communication" },
      { icon: FiBook, label: "Digital Library", path: "/admin/library", section: "Resources" },
      { icon: FiTruck, label: "Bus Tracking", path: "/admin/bus-tracking", section: "Services" },
      { icon: FiFileText, label: "Timeline", path: "/timeline", section: "Communication" },
    ],
    teacher: [
      { icon: FiUser, label: "My Profile", path: "/my-profile", section: "Personal" },
      { icon: FiUsers, label: "My Classes", path: "/my-classes", section: "Teaching" },
      { icon: FiCalendar, label: "Schedule", path: "/class-timetable", section: "Teaching" },
      { icon: FiBookOpen, label: "Lesson Planner", path: "/exams-and-lesson-planner", section: "Teaching" },
      { icon: FiMessageSquare, label: "Messages", path: "/messages", section: "Communication" },
      { icon: FiBook, label: "Digital Library", path: "/library", section: "Resources" },
      { icon: FiTruck, label: "Bus Tracking", path: "/bus-tracking", section: "Services" },
      { icon: FiFileText, label: "Timeline", path: "/timeline", section: "Communication" },
    ],
    student: [
      { icon: FiUsers, label: "My Class", path: "/student/my-classes", section: "Academic" },
      { icon: FiMessageSquare, label: "Messages", path: "/messages", section: "Communication" },
      { icon: FiDollarSign, label: "Fee Status", path: "/student/fee-status", section: "Financial" },
      { icon: FiBook, label: "Digital Library", path: "/library", section: "Resources" },
      { icon: FiTruck, label: "Bus Tracking", path: "/bus-tracking", section: "Services" },
    ],
    parent: [
      { icon: FiUsers, label: "Child's Classes", path: "/parent/child-classes", section: "Academic" },
      { icon: FiMessageSquare, label: "Messages", path: "/messages", section: "Communication" },
      { icon: FiDollarSign, label: "Fee Status", path: "/parent/fee-status", section: "Financial" },
      { icon: FiBook, label: "Digital Library", path: "/library", section: "Resources" },
      { icon: FiTruck, label: "Bus Tracking", path: "/bus-tracking", section: "Services" },
    ]
  };

  return [...commonItems, ...(roleSpecificItems[role] || [])];
};

// Main App Component
function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const sessionUser = getSession();
    if (!sessionUser) {
      navigate("/");
    } else {
      setUser(sessionUser);
      setRole(sessionUser.role);
    }
  }, [navigate]);

  const handleLogout = () => {
    clearSession();
    navigate("/");
  };

  const navigationItems = getNavigationItems(role);
  
  // Group items by section
  const groupedItems = navigationItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {});

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  if (!user) return null;

  return (
    <AppContainer>
      <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <FiX /> : <FiMenu />}
      </MobileMenuButton>

      <Overlay show={mobileMenuOpen} onClick={() => setMobileMenuOpen(false)} />

      <Sidebar collapsed={sidebarCollapsed} mobileOpen={mobileMenuOpen}>
        <SidebarHeader>
          <Logo>
            <LogoIcon>S</LogoIcon>
            <LogoText collapsed={sidebarCollapsed}>SMART</LogoText>
          </Logo>
          <CollapseButton onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <FiMenu />
          </CollapseButton>
        </SidebarHeader>

        <SidebarNav>
          {Object.entries(groupedItems).map(([section, items]) => (
            <NavSection key={section}>
              <SectionTitle collapsed={sidebarCollapsed}>{section}</SectionTitle>
              {items.map((item) => (
                <MenuItem
                  key={item.path}
                  active={location.pathname === item.path}
                  collapsed={sidebarCollapsed}
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </MenuItem>
              ))}
            </NavSection>
          ))}
        </SidebarNav>

        <UserSection>
          <UserAvatar>
            {user.username.charAt(0).toUpperCase()}
          </UserAvatar>
          <UserInfo collapsed={sidebarCollapsed}>
            <UserName>{user.username}</UserName>
            <UserRole>{user.role}</UserRole>
          </UserInfo>
          <MenuItem
            as="button"
            onClick={handleLogout}
            style={{ 
              padding: '0.5rem', 
              margin: 0, 
              width: 'auto',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '6px'
            }}
          >
            <FiLogOut />
          </MenuItem>
        </UserSection>
      </Sidebar>

      <Content sidebarCollapsed={sidebarCollapsed}>
        <Routes>
          <Route
            path="/dashboard"
            element={<Dashboard onLogout={handleLogout} />}
          />
          <Route
            path="/timeline"
            element={<Timeline />}
          />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Content>
    </AppContainer>
  );
}

export default function App() {
  const isLoggedIn = !!getSession();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/*"
          element={isLoggedIn ? <AppLayout /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

