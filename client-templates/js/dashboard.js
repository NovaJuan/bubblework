const openTeamsSidebarBtn = document.querySelector('.open-teams-sidebar');
const closeTeamsSidebarBtn = document.querySelector('.close-teams-sidebar');
const teamsSidebar = document.querySelector('.teams-sidebar');

openTeamsSidebarBtn.addEventListener('click', function() {
	teamsSidebar.classList.add('show');
});

closeTeamsSidebarBtn.addEventListener('click', function() {
	teamsSidebar.classList.remove('show');
});
