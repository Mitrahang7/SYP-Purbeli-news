import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import Login from './Login';
import Signup from './Signup';
import '../styles/Authmodal.css';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, unskippable, customMessage }) {
  const [mode, setMode] = useState('login');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="auth-modal-overlay">

        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={unskippable ? undefined : onClose}
          className="auth-modal-backdrop"
        />

        {/* Modal box */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="auth-modal"
        >
          {/* Close button */}
          {!unskippable && (
            <button onClick={onClose} className="auth-modal__close">
              <X size={20} />
            </button>
          )}

          {/* Header */}
          <div className="auth-modal__header">
            <h2 className="auth-modal__logo">
              PRUBELI<span className="auth-modal__logo-accent">AUTH</span>
            </h2>
            <p className="auth-modal__subtitle">
              {customMessage ? customMessage : (
                mode === 'login'
                  ? 'Welcome back to Prubeli News'
                  : 'Join the Prubeli community today'
              )}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="auth-modal__tabs">
            <button
              className={`auth-modal__tab ${mode === 'login' ? 'auth-modal__tab--active' : ''}`}
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button
              className={`auth-modal__tab ${mode === 'register' ? 'auth-modal__tab--active' : ''}`}
              onClick={() => setMode('register')}
            >
              Sign Up
            </button>
          </div>

          {/* Render existing Login or Signup component */}
          <div className="auth-modal__body">
            {mode === 'login'
              ? <Login onSuccess={() => {
                  if (onLoginSuccess) onLoginSuccess();
                  else onClose();
                }} />
              : <Signup onSuccess={() => {
                  if (onLoginSuccess) onLoginSuccess();
                  else onClose();
                }} />
            }
          </div>

          {/* Footer toggle */}
          <p className="auth-modal__footer">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              className="auth-modal__toggle"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            >
              {mode === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </motion.div>

      </div>
    </AnimatePresence>
  );
}