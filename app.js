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
// Function to check if user data exists in cookies
function userDataExists() {
    const userDataCookie = getCookie('userData');
    return userDataCookie !== '';
}

// Function to open a modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
}

// Function to close a modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

// Function to prompt the user for new user data using the new user modal
function promptNewUserData() {
    console.log('Entering promptNewUserData'); // Debugging log
    
    openModal('newUserModal');
    closeModal('initialModal'); //Remove initial modal

    const loginButton = document.getElementById('loginNewUser');
    loginButton.addEventListener('click', () => {

        console.log('we click on button');
        // Retrieve input values
        const userNameInput = document.getElementById('userName').value;
        const userNicknameInput = document.getElementById('userNickname').value;
        const avatarInput = document.querySelector('input[name="avatar"]:checked').value;

        // Log the inputted data
        console.log('User Name:', userNameInput);
        console.log('User Nickname:', userNicknameInput);
        console.log('Avatar:', avatarInput);

        // Logic to save new user data to cookies
        setCookie('userData', JSON.stringify({
            name: userNameInput,
            nickname: userNicknameInput,
            avatarId: avatarInput,
            completedCourses: [] // Assuming you have this property in your user data
        }), 365);

        // Close the modal
        closeModal('newUserModal');
        refreshApplication(); //Refresh we see the new data
    });
}

// Function to prompt the user for existing user data using the existing user modal
function promptExistingUserData() {
    console.log('Entering existing user modal');

    openModal('existingUserModal');

    closeModal('initialModal'); //Remove initial modal

    const loginButton = document.getElementById('loginExistingUser');
    loginButton.addEventListener('click', async () => {
        const usernameInput = document.getElementById('existingUserName');
        const passwordInput = document.getElementById('userPassword');

        // Get the entered username and password
        const enteredUsername = usernameInput.value;
        const enteredPassword = passwordInput.value; 

        try {
            // Fetch data from lse-members.json
            const response = await fetch('lse-members.json');
            const membersData = await response.json();

            // Check if entered username and password match any user in the JSON file
            const userMatch = membersData.find(user => user.username === enteredUsername && user.password === enteredPassword);

            if (userMatch) {
                // If user is found, save user data to cookies and close the modal
                const userData = {
                    name: userMatch.fullname,
                    nickname: userMatch.username,
                    avatarId: userMatch.avatarId,
                };

                setCookie('userData', JSON.stringify(userData), 365);
                closeModal('existingUserModal');
                refreshApplication(); //Refresh we see the new data
            } else {
                // If user is not found or credentials are incorrect, show an error message
                // You can customize this part based on your design
                const errorText = document.getElementById('errorText');
                errorText.textContent = 'Invalid username or password';
            }
        } catch (error) {
            console.error('Error fetching members data:', error);
        }
    });

    // Link to trigger the new user modal from the existing user modal
    const newUserLink = document.getElementById('newUserLink');
    newUserLink.addEventListener('click', () => {
        closeModal('existingUserModal'); // Close existing user modal
        promptNewUserData(); // Trigger the new user modal
    });
}

// Function to update user info
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
        const avatarPath = `avatar-${avatarId}.jpg`;
        avatarElement.src = avatarPath;
    } else {
        // Default avatar
        avatarElement.src = "avatar-00.jpg";
    }
}

// Function to update completion percentage
async function updateCompletionPercentage() {
    const completedCourses = getCompletedCourses(); // Make sure this function is defined globally
    console.log('Completed Courses:', completedCourses);

    const totalCourses = await getNumberOfCourses();
    console.log('Total Courses:', totalCourses);

    const completionPercentageElement = document.getElementById('completionPercentage');

    if (completionPercentageElement) {
        if (totalCourses === 0) {
            completionPercentageElement.innerText = '0%';
        } else {
            const completedCount = completedCourses.filter(courseId => !isNaN(parseInt(courseId))).length;
            const completionPercentage = (completedCount / totalCourses) * 100;
            completionPercentageElement.innerText = completionPercentage.toFixed(2) + '%';
        }
    }
}

// Function to get completed courses from the cookie
function getCompletedCourses() {
    const completedCoursesCookie = getCookie('completedCourses');
    return completedCoursesCookie ? JSON.parse(completedCoursesCookie) : [];
}

// Function to get the total number of courses (assuming you have a courses.json file)
async function getNumberOfCourses() {
    try {
        // Fetch the courses data from courses.json
        const response = await fetch('courses.json');
        const coursesData = await response.json();

        return coursesData.length;
    } catch (error) {
        console.error('Error fetching courses data:', error);
        return 0;
    }
}

function refreshApplication() {
    location.reload();
    console.log('Application refreshed');
}

// Check if user data exists, otherwise start with the initial modal
if (!userDataExists()) {
    openModal('initialModal');
}

// Initialize completion percentage and user info on page load
updateCompletionPercentage();
updateUserInfo();