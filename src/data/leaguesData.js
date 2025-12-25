// Leagues definition and logic
export const leagues = [
    { id: 1, name: 'Bronze', color: '#cd7f32', minXp: 0, promoteTop: 10, demoteBottom: 0, icon: '🛡️' },
    { id: 2, name: 'Silver', color: '#c0c0c0', minXp: 0, promoteTop: 10, demoteBottom: 5, icon: '⚔️' },
    { id: 3, name: 'Gold', color: '#ffd700', minXp: 0, promoteTop: 10, demoteBottom: 5, icon: '👑' },
    { id: 4, name: 'Sapphire', color: '#0f52ba', minXp: 0, promoteTop: 10, demoteBottom: 5, icon: '💎' },
    { id: 5, name: 'Ruby', color: '#e0115f', minXp: 0, promoteTop: 10, demoteBottom: 5, icon: '🔴' },
    { id: 6, name: 'Emerald', color: '#50c878', minXp: 0, promoteTop: 10, demoteBottom: 5, icon: '🟢' },
    { id: 7, name: 'Amethyst', color: '#9966cc', minXp: 0, promoteTop: 5, demoteBottom: 5, icon: '⚛️' },
    { id: 8, name: 'Pearl', color: '#eae0c8', minXp: 0, promoteTop: 5, demoteBottom: 5, icon: '⚪' },
    { id: 9, name: 'Obsidian', color: '#000000', minXp: 0, promoteTop: 5, demoteBottom: 5, icon: '⚫' },
    { id: 10, name: 'Diamond', color: '#b9f2ff', minXp: 0, promoteTop: 0, demoteBottom: 5, icon: '💠' },
]

export const getLeagueById = (id) => leagues.find(l => l.id === id) || leagues[0]

export const getLeagueByName = (name) => leagues.find(l => l.name.toLowerCase() === name.toLowerCase()) || leagues[0]
