import React from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { UserOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh', paddingTop: '80px' }}>
      <Navbar />
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '2.5rem 1rem' }}>
        <div style={{
          background: 'rgba(255,255,255,0.10)',
          borderRadius: '18px',
          padding: '2.5rem 2rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          marginTop: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <div style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2786ee 65%, #5eead4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            color: '#fff',
            marginBottom: 24,
            boxShadow: '0 2px 12px rgba(0,0,0,0.10)'
          }}>
            <UserOutlined />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>
            {user?.firstName} {user?.lastName}
          </div>
          <div style={{ color: 'var(--color-muted)', fontSize: '1.08rem', marginBottom: 18, textAlign: 'center' }}>
            <MailOutlined style={{ marginRight: 8 }} />{user?.email}
          </div>
          <div style={{ color: 'var(--color-accent)', fontWeight: 500, fontSize: '1.08rem', marginBottom: 18 }}>
            <IdcardOutlined style={{ marginRight: 8 }} />{user?.role || 'student'}
          </div>
          <div style={{ marginTop: 24, width: '100%', textAlign: 'center', color: 'var(--color-muted)' }}>
            <em>Profile actions coming soon...</em>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 