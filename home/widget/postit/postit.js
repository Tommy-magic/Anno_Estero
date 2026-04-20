// Post-it Widget Functionality
let postits = [];
let selectedColor = 'yellow';

// Load postits from localStorage
function loadPostits() {
    const savedPostits = localStorage.getItem('annoEsteroPostits');
    if (savedPostits) {
        postits = JSON.parse(savedPostits);
    }
}

// Save postits to localStorage
function savePostits() {
    localStorage.setItem('annoEsteroPostits', JSON.stringify(postits));
}

// Initialize postit widget
function initializePostitWidget() {
    loadPostits();
    renderPostits();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Open modal
    document.getElementById('postit-open').addEventListener('click', openPostitModal);

    // Close modal
    document.getElementById('postit-close').addEventListener('click', closePostitModal);

    // Save postit
    document.getElementById('postit-save').addEventListener('click', savePostit);

    // Color selection
    document.querySelectorAll('.postit-dot').forEach(dot => {
        dot.addEventListener('click', function() {
            selectColor(this.getAttribute('data-color'));
        });
    });

    // Close modal on overlay click
    document.getElementById('postit-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closePostitModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.getElementById('postit-overlay').classList.contains('active')) {
            closePostitModal();
        }
    });
}

// Open postit modal
function openPostitModal() {
    document.getElementById('postit-overlay').classList.add('active');
    document.getElementById('postit-textarea').focus();
    document.getElementById('postit-textarea').value = '';
    selectColor('yellow'); // Reset to default color
}

// Close postit modal
function closePostitModal() {
    document.getElementById('postit-overlay').classList.remove('active');
}

// Select color
function selectColor(color) {
    selectedColor = color;

    // Update UI
    document.querySelectorAll('.postit-dot').forEach(dot => {
        dot.classList.remove('sel');
    });
    document.querySelector(`[data-color="${color}"]`).classList.add('sel');
}

// Save postit
function savePostit() {
    const textarea = document.getElementById('postit-textarea');
    const text = textarea.value.trim();

    if (text) {
        const postit = {
            id: Date.now(),
            text: text,
            color: selectedColor,
            createdAt: new Date().toISOString()
        };

        postits.push(postit);
        savePostits();
        renderPostits();
        closePostitModal();
    }
}

// Delete postit
function deletePostit(id) {
    postits = postits.filter(p => p.id !== id);
    savePostits();
    renderPostits();
}

// Render postits
function renderPostits() {
    const grid = document.getElementById('postit-grid');
    const empty = document.getElementById('postit-empty');

    // Remove all postit notes
    const notes = grid.querySelectorAll('.postit-note');
    notes.forEach(note => note.remove());

    if (postits.length === 0) {
        empty.style.display = 'block';
    } else {
        empty.style.display = 'none';

        // Sort by creation date (newest first)
        const sortedPostits = [...postits].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        sortedPostits.forEach(postit => {
            const postitElement = document.createElement('div');
            postitElement.className = `postit-note ${postit.color}`;

            const date = new Date(postit.createdAt);
            const formattedDate = date.toLocaleDateString('it-IT', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });

            postitElement.innerHTML = `
                <div class="postit-note-content">${postit.text}</div>
                <div class="postit-note-date">${formattedDate}</div>
                <button class="postit-note-delete" onclick="deletePostit(${postit.id})" title="Elimina nota">×</button>
            `;

            grid.appendChild(postitElement);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePostitWidget();
});