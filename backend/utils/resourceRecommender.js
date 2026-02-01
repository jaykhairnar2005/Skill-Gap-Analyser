/**
 * Smart Course & Resource Recommender
 * 
 * Maps technical skills to high-quality learning resources.
 */

const getRecommendedResources = (skillName) => {
    if (!skillName) return [];

    const skill = skillName.toLowerCase().trim();
    const resources = [];

    // 1. Docker / Containerization
    if (skill.includes('docker') || skill.includes('container')) {
        resources.push(
            { name: 'Docker Docs', url: 'https://docs.docker.com/get-started/' },
            { name: 'Docker for Beginners (YouTube)', url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo' },
            { name: 'Play with Docker', url: 'https://labs.play-with-docker.com/' }
        );
    }

    // 2. Kubernetes / K8s
    if (skill.includes('kubernetes') || skill.includes('k8s')) {
        resources.push(
            { name: 'Kubernetes Docs', url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/' },
            { name: 'K8s for Beginners (YouTube)', url: 'https://www.youtube.com/watch?v=X48VuDVv0do' },
            { name: 'Minikube Tutorial', url: 'https://minikube.sigs.k8s.io/docs/start/' }
        );
    }

    // 3. React
    if (skill.includes('react')) {
        resources.push(
            { name: 'React Official Docs', url: 'https://react.dev/learn' },
            { name: 'FreeCodeCamp React Course', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8' },
            { name: 'Scrimba Learn React', url: 'https://scrimba.com/learn/learnreact' }
        );
    }

    // 4. Node.js
    if (skill.includes('node')) {
        resources.push(
            { name: 'Node.js Docs', url: 'https://nodejs.org/en/docs/guides/getting-started-guide/' },
            { name: 'Node.js Crash Course', url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4' }
        );
    }

    // 5. Python
    if (skill.includes('python')) {
        resources.push(
            { name: 'Python.org Docs', url: 'https://docs.python.org/3/tutorial/' },
            { name: 'Automate the Boring Stuff', url: 'https://automatetheboringstuff.com/' },
            { name: 'Real Python', url: 'https://realpython.com/' }
        );
    }

    // 6. Cyber Security
    if (skill.includes('security') || skill.includes('cyber') || skill.includes('penetration')) {
        resources.push(
            { name: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/' },
            { name: 'TryHackMe', url: 'https://tryhackme.com/' },
            { name: 'Hack The Box', url: 'https://www.hackthebox.com/' }
        );
    }

    // 7. Blockchain / Web3
    if (skill.includes('blockchain') || skill.includes('web3') || skill.includes('ethereum')) {
        resources.push(
            { name: 'Ethereum Docs', url: 'https://ethereum.org/en/developers/docs/' },
            { name: 'CryptoZombies', url: 'https://cryptozombies.io/' },
            { name: 'Solidity Docs', url: 'https://docs.soliditylang.org/' }
        );
    }

    // 8. SQL / Database
    if (skill.includes('sql') || skill.includes('database')) {
        resources.push(
            { name: 'W3Schools SQL', url: 'https://www.w3schools.com/sql/' },
            { name: 'SQLBolt', url: 'https://sqlbolt.com/' }
        );
    }

    // Fallback if no specific resources found
    if (resources.length === 0) {
        resources.push(
            { name: `${skillName} - Google Search`, url: `https://www.google.com/search?q=learn+${encodeURIComponent(skillName)}` },
            { name: `${skillName} - YouTube`, url: `https://www.youtube.com/results?search_query=learn+${encodeURIComponent(skillName)}` }
        );
    }

    // Return unique resources (deduped by url just in case)
    return [...new Map(resources.map(item => [item['url'], item])).values()];
};

module.exports = { getRecommendedResources };
