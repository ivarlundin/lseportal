 // Function to get a specific cookie by name
 function getCookie(name) {
    let cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if (name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

// Function to initialize the certificates
function initCertificates() {
    const completedCourses = getCookie("completedCourses");
    if (completedCourses) {
        const completedArray = JSON.parse(completedCourses);
        completedArray.forEach(courseNumber => {
            const imgElement = document.getElementById(`course${courseNumber}`);
            if (imgElement) {
                imgElement.classList.add("done");
            }
        });
    }
}

// Initialize the certificates on page load
window.onload = initCertificates;