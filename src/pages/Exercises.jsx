import React from 'react'
import { Dumbbell, Ear, MessageSquare, Target, ChevronRight, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'

function Exercises() {
    const navigate = useNavigate()
    const { currentLearningLanguage, nativeLanguage } = useStore()

    const exerciseCategories = [
        {
            id: 'targeted',
            title: 'Targeted Practice',
            description: 'Focus on weak areas and difficult concepts.',
            icon: Target,
            color: 'bg-red-500',
            textColor: 'text-red-500',
            locked: false,
        },
        {
            id: 'listening',
            title: 'Listening Mode',
            description: 'Improve your comprehension with audio-only exercises.',
            icon: Ear,
            color: 'bg-blue-500',
            textColor: 'text-blue-500',
            locked: false,
        },
        {
            id: 'speaking',
            title: 'Speaking Drills',
            description: 'Practice pronunciation and conversation skills.',
            icon: MessageSquare,
            color: 'bg-green-500',
            textColor: 'text-green-500',
            locked: true,
        },
        {
            id: 'mistakes',
            title: 'Mistakes Review',
            description: 'Review and correct your past mistakes.',
            icon: Dumbbell,
            color: 'bg-amber-500',
            textColor: 'text-amber-500',
            locked: false, // Could be premium feature in future
        }
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Practice Hub</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {exerciseCategories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => !category.locked && navigate(`/lesson/practice/${category.id}`)} // Placeholder route
                        className={`flex items-center p-4 rounded-2xl border-b-4 transition-all text-left group relative ${category.locked
                                ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-75'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 active:border-b-0 active:translate-y-1'
                            }`}
                    >
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center mr-4 ${category.locked ? 'bg-gray-200 dark:bg-gray-700 text-gray-400' : `${category.color}/20 ${category.textColor}`
                            }`}>
                            {category.locked ? <Lock size={28} /> : <category.icon size={28} />}
                        </div>

                        <div className="flex-1">
                            <h3 className={`font-bold text-lg ${category.locked ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                                {category.title}
                            </h3>
                            <p className={`text-sm font-medium ${category.locked ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                {category.description}
                            </p>
                        </div>

                        {!category.locked && (
                            <ChevronRight className="text-gray-300 group-hover:text-gray-400 transition-colors" size={24} />
                        )}

                        {category.locked && (
                            <div className="absolute top-2 right-2 bg-brand-secondary text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                                Coming Soon
                            </div>
                        )}
                    </button>
                ))}
            </div>

            <div className="bg-brand-primary/10 rounded-2xl p-6 text-center border-2 border-brand-primary/20 mt-8">
                <h2 className="text-xl font-bold text-brand-primary mb-2">Daily Practice Goal</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Complete 2 practice sessions to earn a bonus chest!</p>
                <div className="w-full max-w-xs mx-auto bg-white dark:bg-gray-800 rounded-full h-4 overflow-hidden border border-brand-primary/20">
                    <div className="bg-brand-primary h-full w-1/2 transition-all duration-500"></div>
                </div>
                <p className="text-sm font-bold text-brand-primary mt-2">1 / 2 Completed</p>
            </div>
        </div>
    )
}

export default Exercises
