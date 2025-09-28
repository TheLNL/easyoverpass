document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const generateOsmIdBtn = document.getElementById('generateOsmIdQuery');
    const osmElementType = document.getElementById('osmElementType');
    const osmIdInput = document.getElementById('osmId');
    const recurseDown = document.getElementById('recurseDown');
    const queryOutput = document.getElementById('queryOutput');
    const copyQueryBtn = document.getElementById('copyQuery');
    const openInOverpassTurbo = document.getElementById('openInOverpassTurbo');
    
    // Check if all required elements exist
    if (!generateOsmIdBtn || !osmElementType || !osmIdInput || !recurseDown || !queryOutput || !copyQueryBtn || !openInOverpassTurbo) {
        console.error('One or more required elements not found');
        alert('Error: Could not initialize the application. Please check the console for details.');
        return;
    }
    
    // Initialize the application
    function init() {
        console.log('Initializing Overpass Query Builder...');
        
        // Add event listeners
        setupEventListeners();
        
        // Generate initial empty query
        queryOutput.textContent = '// Enter an OSM ID and click "Generate Query" to create your query';
    }
    
    // Set up all event listeners
    function setupEventListeners() {
        // Generate OSM ID Query button
        generateOsmIdBtn.addEventListener('click', generateOsmIdQuery);
        
        // Handle Enter key in OSM ID input
        osmIdInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                generateOsmIdQuery();
            }
        });
        
        // Copy query button
        copyQueryBtn.addEventListener('click', copyQueryToClipboard);
        
        // Open in Overpass Turbo
        openInOverpassTurbo.addEventListener('click', (e) => {
            e.preventDefault();
            openInOverpassTurboHandler();
        });
    }
    
    // Copy query to clipboard
    function copyQueryToClipboard() {
        const query = queryOutput.textContent;
        if (query && !query.includes('Enter an OSM ID') && !query.includes('No query to copy')) {
            navigator.clipboard.writeText(query.trim())
                .then(() => {
                    console.log('Query copied to clipboard!');
                    alert('Query copied to clipboard!');
                })
                .catch(err => {
                    console.error('Failed to copy query: ', err);
                    alert('Failed to copy query');
                });
        } else {
            alert('No query to copy');
        }
    }
    
    // Open query in Overpass Turbo
    function openInOverpassTurboHandler() {
        const query = queryOutput.textContent;
        if (query && !query.includes('Enter an OSM ID') && !query.includes('No query to copy')) {
            const encodedQuery = encodeURIComponent(query.trim());
            const turboUrl = `https://overpass-turbo.eu/?Q=${encodedQuery}`;
            window.open(turboUrl, '_blank');
        } else {
            alert('Please generate a query first');
        }
    }
    
    // Store the current query for export
    let currentQuery = '';
    
    // Generate Overpass QL for OSM ID
    function generateOsmIdQuery() {
        console.log('Generating OSM ID query...');
        
        // Get values
        const elementType = osmElementType.value;
        const osmId = osmIdInput.value.trim();
        const shouldRecurse = recurseDown.checked;
        
        if (!osmId) {
            alert('Please enter an OSM ID');
            return;
        }
        
        // Generate the complete query
        let query = `[out:json][timeout:30];\n`;
        
        if (shouldRecurse) {
            query += `(\n  ${elementType}(${osmId});\n  >;\n);\n`;
        } else {
            query += `${elementType}(${osmId});\n`;
        }
        
        // Complete the query
        query += `out body;\n>;\nout skel qt;`;
        
        // Store the current query
        currentQuery = query;
        
        // Set the output text
        queryOutput.textContent = query;
        console.log('Generated query:', query);
        
        // Update export buttons
        updateExportButtons(query);
        
        // Show success message
        alert('Query generated successfully!');
    }
    
    // Update export buttons with the current query
    function updateExportButtons(query) {
        // Update Overpass Turbo link
        if (openInOverpassTurbo) {
            const encodedQuery = encodeURIComponent(query);
            openInOverpassTurbo.href = `https://overpass-turbo.eu/?Q=${encodedQuery}`;
        }
    }
    
    // Initialize the application
    init();
});
