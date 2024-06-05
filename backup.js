backupo

// Function to prompt the user for data using a modal
function promptUserData() {
    const modal = document.getElementById('existingUserModal');
    modal.classList.add('active'); // Add "active" class to show the modal

    closeModal('initialModal'); //Remove initial modal

    const saveButton = document.getElementById('saveUserData');
    saveButton.addEventListener('click', () => {
        const name = document.getElementById('userName').value;
        const nickname = document.getElementById('userNickname').value;
        const avatarId = document.querySelector('input[name="avatar"]:checked').value;

        const userData = {
            name: name,
            nickname: nickname,
            avatarId: avatarId,
        };

        // Save user data to cookie
        setCookie('userData', JSON.stringify(userData), 365);

        // Remove "active" class to hide the modal
        modal.classList.remove('active');

        // Initialize completion percentage on page load
        updateCompletionPercentage();
    });
}