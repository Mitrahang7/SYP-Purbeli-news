import React from 'react';
import { Phone, Hospital, Shield, Flame, AlertCircle } from 'lucide-react';
import '../styles/EmergencyHub.css';

const contacts = [
  { icon: Shield, name: 'District Police', number: '100', color: 'red' },
  { icon: Flame, name: 'Fire Department', number: '101', color: 'orange' },
  { icon: Hospital, name: 'Ambulance', number: '102', color: 'blue' },
  { icon: Shield, name: 'Police Helpline', number: '021-524199', color: 'gray' },
  { icon: Hospital, name: 'Zenith Hospital', number: '021-532454', color: 'gray' }
];

export const EmergencyHub = () => {
  return (
    <div className="emergency-hub">
      <div className="emergency-hub__header">
        <h3 className="emergency-hub__title">Emergency Help Desk</h3>
        <p className="emergency-hub__subtitle">Purbanchal Region • Connect Instantly</p>
      </div>
      
      <div className="emergency-hub__grid">
        {contacts.map((contact, index) => (
          <a key={index} href={`tel:${contact.number}`} className="emergency-card">
            <div className={`emergency-card__icon-box ${contact.color}`}>
              <contact.icon size={18} />
            </div>
            <div className="emergency-card__info">
              <span className="emergency-card__name">{contact.name}</span>
              <span className="emergency-card__number">{contact.number}</span>
            </div>
          </a>
        ))}
      </div>
      
      <div className="emergency-hub__footer">
        <AlertCircle size={12} />
        <span>In case of life-threatening events, call 100 first.</span>
      </div>
    </div>
  );
};
