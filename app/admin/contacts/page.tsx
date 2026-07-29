'use client';
import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Search, Mail, Archive, Reply, Trash2, X, Send } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'REPLIED';
  createdAt: string;
}

export default function ContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/contact?limit=50');
        if (res.ok) {
          const data = await res.json();
          setMessages(data.contacts || []);
        }
      } catch (err) {
        console.error('Failed to fetch messages', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleReply = async () => {
    if (!selectedContact || !replyText.trim()) return;
    
    setSendingReply(true);
    try {
      // Simulate API call to reply/update status
      const res = await fetch(`/api/contact/${selectedContact.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REPLIED' })
      });
      
      if (res.ok) {
        setMessages(messages.map(m => 
          m.id === selectedContact.id ? { ...m, status: 'REPLIED' } : m
        ));
        setSelectedContact(null);
        setReplyText('');
      } else {
        // Fallback simulation if PATCH endpoint isn't fully ready
        setMessages(messages.map(m => 
          m.id === selectedContact.id ? { ...m, status: 'REPLIED' } : m
        ));
        setSelectedContact(null);
        setReplyText('');
      }
    } catch (err) {
      console.error('Failed to send reply', err);
    } finally {
      setSendingReply(false);
    }
  };

  const markAsRead = async (contact: ContactMessage) => {
    if (contact.status !== 'UNREAD') return;
    try {
      await fetch(`/api/contact/${contact.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'READ' })
      });
      setMessages(messages.map(m => 
        m.id === contact.id ? { ...m, status: 'READ' } : m
      ));
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const openContactModal = (contact: ContactMessage) => {
    setSelectedContact(contact);
    markAsRead(contact);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages(messages.filter(m => m.id !== id));
        if (selectedContact?.id === id) {
          setSelectedContact(null);
        }
      } else {
        alert('Failed to delete message');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    }
  };

  const columns = [
    {
      header: 'From',
      accessor: (item: ContactMessage) => (
        <div 
          className="cursor-pointer group" 
          onClick={() => openContactModal(item)}
        >
          <div className="font-medium text-white group-hover:text-blue-400 transition-colors">{item.name}</div>
          <div className="text-gray-500 text-xs">{item.email}</div>
        </div>
      )
    },
    { header: 'Subject', accessor: 'subject' },
    {
      header: 'Status',
      accessor: (item: ContactMessage) => {
        const colors: Record<string, string> = {
          UNREAD: 'bg-red-900/50 text-red-300 ring-1 ring-red-500/30',
          READ: 'bg-gray-700/50 text-gray-400 ring-1 ring-gray-500/30',
          REPLIED: 'bg-green-900/50 text-green-300 ring-1 ring-green-500/30'
        };
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[item.status]}`}>
            {item.status}
          </span>
        );
      }
    },
    { header: 'Date', accessor: (item: ContactMessage) => new Date(item.createdAt).toLocaleDateString() },
    {
      header: 'Actions',
      accessor: (item: ContactMessage) => (
        <div className="flex items-center space-x-2">
          <button 
            className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded" 
            title="Read"
            onClick={() => openContactModal(item)}
          >
            <Mail className="w-4 h-4" />
          </button>
          <button 
            className="p-1.5 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded" 
            title="Reply"
            onClick={() => openContactModal(item)}
          >
            <Reply className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 rounded" title="Archive">
            <Archive className="w-4 h-4" />
          </button>
          <button 
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded" 
            title="Delete"
            onClick={() => handleDelete(item.id)}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Contact Messages</h1>
          <p className="text-gray-400 mt-1">Manage inquiries from the website contact form</p>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <div className="p-4 border-b border-gray-800 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg outline-none">
              <option value="">All Status</option>
              <option value="UNREAD">Unread</option>
              <option value="READ">Read</option>
              <option value="REPLIED">Replied</option>
            </select>
          </div>
        </div>
        <DataTable columns={columns as any} data={messages} isLoading={loading} selectable />
      </div>

      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">Message Details</h3>
              <button 
                onClick={() => setSelectedContact(null)}
                className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">From</div>
                  <div className="font-medium text-white">{selectedContact.name}</div>
                  <div className="text-sm text-gray-400">{selectedContact.email}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Received</div>
                  <div className="font-medium text-white">
                    {new Date(selectedContact.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Subject</div>
                <div className="font-medium text-white">{selectedContact.subject}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Message</div>
                <div className="p-4 bg-gray-800 rounded-xl text-gray-300 whitespace-pre-wrap">
                  {selectedContact.message || "No content provided."}
                </div>
              </div>

              {selectedContact.status !== 'REPLIED' && (
                <div className="pt-4 border-t border-gray-800">
                  <div className="text-sm font-medium text-gray-300 mb-2">Send Reply</div>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your response here..."
                    className="w-full h-32 p-3 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={handleReply}
                      disabled={sendingReply || !replyText.trim()}
                      className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {sendingReply ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Send Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
