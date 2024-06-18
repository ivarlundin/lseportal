// home.js

// Function to generate course links
function generateCourseLinks() {
    const coursesContainer = document.getElementById('coursesContainer');

    // Fetch the courses data from courses.json
    fetch('courses.json')
        .then(response => response.json())
        .then(coursesData => {
            // Create an unordered list
            const courseList = document.createElement('ul');

            // Get completed courses from the cookie
            const completedCourses = getCompletedCourses();

            // Iterate through the courses data
            coursesData.forEach(course => {
                const listItem = document.createElement('li');

                // Create a div to hold the course name and checkmark icon
                const itemDiv = document.createElement('div');
                itemDiv.className = 'courseItem';

                // Check if the course has been completed
                if (completedCourses.includes(course.id)) {
                    listItem.classList.add('course-complete');
                }

                // Course name
                const link = document.createElement('a');
                link.href = `${course.index}.html`;
                link.textContent = course.name;

                // Checkmark icon
                const checkmarkIcon = document.createElement('span');
                checkmarkIcon.className = 'checkmarkIcon';

                // Append the course name and checkmark icon to the div
                itemDiv.appendChild(link);
                itemDiv.appendChild(checkmarkIcon);

                // Append the div to the list item
                listItem.appendChild(itemDiv);

                // Append the list item to the unordered list
                courseList.appendChild(listItem);
            });

            // Append the unordered list to the coursesContainer
            coursesContainer.appendChild(courseList);
        })
        .catch(error => console.error('Error fetching courses data:', error));
}

// Call the function to generate course links
generateCourseLinks();