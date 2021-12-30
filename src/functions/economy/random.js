/*

Randomizers for use by the /work and /crime commands, with individual response options for each.

*/

module.exports = {

    // Work response randomizer
    work: async function() {
        const jobs = [
            "Software Dev",
            "Janitor",
            "Discord Mod",
            "Developer",
            "Fisherman",
            "Partnership Manager",
            "Lawyer",
            "Community Manager"
        ];

        const choose = jobs[Math.floor(Math.random() * jobs.length)];

        return `You worked as a ${choose} and earned`;
    },
    
    // Crime response randomizer
    crime: async function() {
        const jobs = [
            "stole and sold someone's cot",
            "robbed a bank",
            "sholifter",
            "became a bus",
            "stole someone's boat"
        ];

        const choose = jobs[Math.floor(Math.random() * jobs.length)];

        return `You ${choose} and earned`;
    }
}