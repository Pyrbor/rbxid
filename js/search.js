let pages = [];

fetch('js/pages.json')
    .then(response => response.json())
    .then(data => {
        pages = data;
    })
    .catch(error => console.error('error fetching pages.json!!', error));

function searchPages() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const resultList = document.getElementById('resultList');
    
    // clear previous results
    resultList.innerHTML = '';

    // filters and sort results based on tags or name
    const filteredPages = pages.filter(page => 
        page.display_name.toLowerCase().includes(input) ||
        page.name.toLowerCase().includes(input) ||
        page.tags.some(tag => tag.toLowerCase().includes(input))
    );

    // makes so that exact matches have priority
    filteredPages.sort((a, b) => {
        const inputLower = input.toLowerCase();
        const adisplay_nameLower = a.display_name.toLowerCase();
        const bdisplay_nameLower = b.display_name.toLowerCase();
        const aNameLower = a.name.toLowerCase();
        const bNameLower = b.name.toLowerCase();

        // checks if a page is an exact match
        const aIsExactMatch = adisplay_nameLower === inputLower || aNameLower === inputLower;
        const bIsExactMatch = bdisplay_nameLower === inputLower || bNameLower === inputLower;

        // puts exact match above
        if (aIsExactMatch && !bIsExactMatch) {
            return -1;
        }
        if (!aIsExactMatch && bIsExactMatch) {
            return 1;
        }

        // in case both or neither are exact matches, sort by display_name
        return adisplay_nameLower.localeCompare(bdisplay_nameLower);
    });

    // create and append list items
    filteredPages.forEach(page => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = page.url;
        a.textContent = page.display_name;

        // set title attribute
        a.title = `Uploaded by ${page.creator}`; 

        // in case it is an exact match or tag match
        if (page.display_name.toLowerCase() === input || page.name.toLowerCase() === input) {
            a.classList.add('exact-match');
        } else if (page.tags.some(tag => input.includes(tag.toLowerCase()))) {
            a.classList.add('tag-match');
        }

        // append to the result list
        li.appendChild(a);
        resultList.appendChild(li);
    });
}
