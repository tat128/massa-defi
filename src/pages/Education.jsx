import React, { useState } from 'react';
import { 
  AcademicCapIcon, 
  PlayIcon, 
  BookOpenIcon,
  TrophyIcon,
  StarIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  UserGroupIcon,
  LightBulbIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Education = () => {
  const [activeTab, setActiveTab] = useState('tutorials');
  const [selectedTutorial, setSelectedTutorial] = useState(null);

  // Mock data for education features
  const tutorials = [
    {
      id: 1,
      title: 'Getting Started with DeFi',
      description: 'Learn the basics of decentralized finance and how to use Massa DeFi',
      duration: '15 min',
      difficulty: 'beginner',
      completed: true,
      badge: 'DeFi Basics',
      videoUrl: '#',
      steps: [
        'What is DeFi?',
        'Understanding Wallets',
        'Your First Swap',
        'Security Best Practices'
      ]
    },
    {
      id: 2,
      title: 'Yield Farming Masterclass',
      description: 'Advanced strategies for maximizing your yield farming returns',
      duration: '30 min',
      difficulty: 'intermediate',
      completed: false,
      badge: 'Yield Master',
      videoUrl: '#',
      steps: [
        'Understanding APY vs APR',
        'Impermanent Loss',
        'Risk Management',
        'Portfolio Diversification'
      ]
    },
    {
      id: 3,
      title: 'Smart Contract Security',
      description: 'Learn how to identify and avoid common DeFi security risks',
      duration: '45 min',
      difficulty: 'advanced',
      completed: false,
      badge: 'Security Expert',
      videoUrl: '#',
      steps: [
        'Smart Contract Audits',
        'Common Vulnerabilities',
        'Rug Pull Detection',
        'Safe Practices'
      ]
    }
  ];

  const simulators = [
    {
      id: 1,
      title: 'Swap Simulator',
      description: 'Practice swapping tokens without spending real money',
      icon: '🔄',
      status: 'active'
    },
    {
      id: 2,
      title: 'Yield Farming Simulator',
      description: 'Simulate yield farming strategies and see potential returns',
      icon: '🌾',
      status: 'active'
    },
    {
      id: 3,
      title: 'Liquidity Pool Simulator',
      description: 'Learn about impermanent loss and LP strategies',
      icon: '🏊',
      status: 'coming-soon'
    }
  ];

  const userProgress = {
    totalTutorials: tutorials.length,
    completed: tutorials.filter(t => t.completed).length,
    badges: 3,
    reputationScore: 85,
    level: 'Intermediate',
    nextBadge: 'Yield Master'
  };

  const projectReputations = [
    {
      id: 1,
      name: 'MassaSwap',
      logo: '⚡',
      auditScore: 95,
      tvl: '$50M',
      age: '2 years',
      trustScore: 92,
      status: 'verified'
    },
    {
      id: 2,
      name: 'MassaLend',
      logo: '💰',
      auditScore: 88,
      tvl: '$25M',
      age: '1 year',
      trustScore: 85,
      status: 'verified'
    },
    {
      id: 3,
      name: 'MassaStake',
      logo: '🔒',
      auditScore: 98,
      tvl: '$75M',
      age: '3 years',
      trustScore: 96,
      status: 'verified'
    }
  ];

  const knowledgeBase = [
    {
      id: 1,
      title: 'What is Impermanent Loss?',
      category: 'Liquidity Pools',
      difficulty: 'intermediate',
      readTime: '5 min',
      tags: ['LP', 'Risk', 'Yield']
    },
    {
      id: 2,
      title: 'Understanding Gas Fees',
      category: 'Transactions',
      difficulty: 'beginner',
      readTime: '3 min',
      tags: ['Gas', 'Fees', 'Optimization']
    },
    {
      id: 3,
      title: 'DeFi Security Checklist',
      category: 'Security',
      difficulty: 'beginner',
      readTime: '7 min',
      tags: ['Security', 'Best Practices']
    }
  ];

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          Beginner
        </span>;
      case 'intermediate':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
          Intermediate
        </span>;
      case 'advanced':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          Advanced
        </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
          Unknown
        </span>;
    }
  };

  const getTrustScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Education Center</h1>
              <p className="text-blue-100">Learn DeFi safely with tutorials, simulators, and knowledge base</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl p-3">
                <TrophyIcon className="h-8 w-8 text-yellow-300" />
              </div>
              <div>
                <p className="text-sm text-blue-100">Your Level</p>
                <p className="text-2xl font-bold">{userProgress.level}</p>
              </div>
            </div>
          </div>
          
          {/* Progress Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <BookOpenIcon className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Tutorials</p>
                  <p className="text-lg font-bold">{userProgress.completed}/{userProgress.totalTutorials}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <TrophyIcon className="h-5 w-5 text-yellow-300" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Badges</p>
                  <p className="text-lg font-bold">{userProgress.badges}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <StarIcon className="h-5 w-5 text-green-300" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Reputation</p>
                  <p className="text-lg font-bold">{userProgress.reputationScore}/100</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <LightBulbIcon className="h-5 w-5 text-purple-300" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Next Badge</p>
                  <p className="text-lg font-bold">{userProgress.nextBadge}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('tutorials')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'tutorials'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <PlayIcon className="h-4 w-4 inline mr-2" />
          Tutorials
        </button>
        <button
          onClick={() => setActiveTab('simulators')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'simulators'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <AcademicCapIcon className="h-4 w-4 inline mr-2" />
          Simulators
        </button>
        <button
          onClick={() => setActiveTab('reputation')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'reputation'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <ShieldCheckIcon className="h-4 w-4 inline mr-2" />
          Project Reputation
        </button>
        <button
          onClick={() => setActiveTab('knowledge')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'knowledge'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <BookOpenIcon className="h-4 w-4 inline mr-2" />
          Knowledge Base
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'tutorials' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tutorials.map((tutorial) => (
              <div key={tutorial.id} className="modern-card p-6 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tutorial.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{tutorial.description}</p>
                  </div>
                  {tutorial.completed && (
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  )}
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Duration</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{tutorial.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Difficulty</span>
                    {getDifficultyBadge(tutorial.difficulty)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Badge</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      <TrophyIcon className="h-3 w-3 mr-1" />
                      {tutorial.badge}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">What you'll learn:</h4>
                  <ul className="space-y-1">
                    {tutorial.steps.map((step, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <button 
                    className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => setSelectedTutorial(tutorial)}
                  >
                    {tutorial.completed ? 'Review' : 'Start Learning'}
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'simulators' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {simulators.map((simulator) => (
              <div key={simulator.id} className="modern-card p-6 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{simulator.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {simulator.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{simulator.description}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    simulator.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                  }`}>
                    {simulator.status === 'active' ? 'Active' : 'Coming Soon'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button 
                    className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={simulator.status !== 'active'}
                  >
                    Launch Simulator
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'reputation' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projectReputations.map((project) => (
              <div key={project.id} className="modern-card p-6 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{project.logo}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Trust Score: {project.trustScore}/100</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <ShieldCheckIcon className="h-3 w-3 mr-1" />
                    Verified
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Audit Score</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{project.auditScore}/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Total Value Locked</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{project.tvl}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Age</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{project.age}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Trust Score</span>
                    <span className={`font-semibold ${getTrustScoreColor(project.trustScore)}`}>
                      {project.trustScore}/100
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    Audit Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'knowledge' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {knowledgeBase.map((article) => (
              <div key={article.id} className="modern-card p-6 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{article.category}</p>
                  </div>
                  {getDifficultyBadge(article.difficulty)}
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Read Time</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{article.readTime}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {article.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Read Article
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    Bookmark
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tutorial Modal */}
      {selectedTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-2xl relative">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white"
              onClick={() => setSelectedTutorial(null)}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedTutorial.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{selectedTutorial.description}</p>
            
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Course Overview</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <span className="ml-2 font-medium">{selectedTutorial.duration}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Difficulty:</span>
                    <span className="ml-2">{getDifficultyBadge(selectedTutorial.difficulty)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold mb-2">What you'll learn</h3>
                <ul className="space-y-2">
                  {selectedTutorial.steps.map((step, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Start Tutorial
              </button>
              <button 
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                onClick={() => setSelectedTutorial(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Education; 