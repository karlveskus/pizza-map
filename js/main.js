const openSidebar = document.getElementById('openSidebar');
openSidebar.addEventListener('click', function() {
    document.getElementById("sidebar").style.width = "250px";
})

const closeSidebar = document.getElementById('closeSidebar');
closeSidebar.addEventListener('click', function() {
    document.getElementById("sidebar").style.width = "0";
})