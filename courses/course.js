// course.js

// Function to set a cookie
function setCookie(name, value, days) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const cookieString = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = cookieString;
}

// Function to get a cookie value
function getCookie(name) {
    const cookieName = `${name}=`;
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith(cookieName)) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return '';
}

// Function to complete a course
function completeCourse(courseId) {
    const completedCourses = getCompletedCourses();

    // Check if the course ID is already in the completedCourses array
    if (!completedCourses.includes(courseId)) {
        // Your logic to mark the course as completed
        // For example, you might add the course ID to the completed courses array
        completedCourses.push(courseId);

        // Save the completed courses data to the cookie
        setCookie('completedCourses', JSON.stringify(completedCourses), 365);
    } else {
        console.log(`Course ${courseId} is already completed.`);
    }

    location.reload();
}
// Function to get completed courses from the cookie
function getCompletedCourses() {
    const completedCoursesCookie = getCookie('completedCourses');
    return completedCoursesCookie ? JSON.parse(completedCoursesCookie) : [];
}

// Check if user data exists
function userDataExists() {
    const userDataCookie = getCookie('userData');
    return userDataCookie !== '';
}

// Function to update user info (similar to your app.js)
function updateUserInfo() {
    const avatarElement = document.querySelector('.user-profile img');
    const usernameElement = document.querySelector('.user-profile .username');
    const nicknameElement = document.querySelector('.user-profile .nickname');

    if (userDataExists()) {
        const userData = JSON.parse(getCookie('userData'));

        // Update username and nickname
        usernameElement.textContent = userData.name;
        nicknameElement.textContent = userData.nickname;

        // Update avatar
        const avatarId = userData.avatarId;
        const avatarPath = `../assets/avatars/avatar-${avatarId}.jpg`;
        avatarElement.src = avatarPath;
    } else {
        // Default avatar
        avatarElement.src = "../assets/avatars/avatar-0.jpg";
    }
}

// Function to check if the current course is completed
async function checkCourseCompletion() {
    try {
        // Get the current course index from the URL
        const currentCourseIndex = await getCurrentCourseIndex();

        // Get completed courses from the cookie
        const completedCourses = getCompletedCourses();

        // Check if the current course index is in the completed courses array
        const isCourseCompleted = completedCourses.includes(currentCourseIndex);

        // Add the "complete" class to the element with id "courseComplete" if the course is completed
        const courseCompleteElement = document.getElementById('courseComplete');
        if (isCourseCompleted && courseCompleteElement) {
            courseCompleteElement.classList.add('complete');
        }
    } catch (error) {
        console.error('Error checking course completion:', error);
    }
}

// Function to get the current course index from the URL
function getCurrentCourseIndex() {
    // Get the current page URL
    const currentPageUrl = window.location.href;

    // Extract the course index from the URL
    const matches = currentPageUrl.match(/\/(\w+)\.html/);
    const currentCourseIndex = matches ? matches[1] : null;

    // Load courses.json and find the matching course index
    return fetch('courses.json')
        .then(response => response.json())
        .then(courses => {
            const matchingCourse = courses.find(course => course.index === currentCourseIndex);
            return matchingCourse ? matchingCourse.id : null;
        })
        .catch(error => {
            console.error('Error loading courses.json:', error);
            return null;
        });
}

updateUserInfo();
checkCourseCompletion();
