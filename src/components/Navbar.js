import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Navbar({ onAddClick }) {
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out error:', err.message);
    } finally {
      setSigningOut(false);
    }
  };

  // Show only the part before "@" for a cleaner display
  const displayEmail = user?.email
    ? user.email.length > 24
      ? user.email.substring(0, 24) + '…'
      : user.email
    : '';

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-icon">🌍</span>
        <span className="navbar-title">Country Manager</span>
      </div>

      <div className="navbar-actions">
        {onAddClick && (
          <button id="add-country-btn" className="btn btn-primary" onClick={onAddClick}>
            + Add Country
          </button>
        )}

        {user && (
          <div className="navbar-user">
            <span className="navbar-user-email" title={user.email}>
              {displayEmail}
            </span>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleSignOut}
              disabled={signingOut}
            >
              {signingOut ? 'Signing out…' : 'Sign Out'}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
