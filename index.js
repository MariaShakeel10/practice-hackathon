import {
  getAuth,
  onAuthStateChanged,
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  db,
  auth,
  signOut
} from "./firebase.js";

// const auth = getAuth();
// const db = getFirestore();

const createPostForm = document.getElementById("createPostForm");

// Function to display posts
const displayPosts = async () => {
  const postsContainer = document.getElementById("display-posts");
  postsContainer.innerHTML = "";

  const postsSnapshot = await getDocs(collection(db, "posts"));
  postsSnapshot.forEach((doc) => {
    const post = doc.data();
    const postDiv = document.createElement("div");
    postDiv.classList.add("container", "mt-3", "d-flex", "flex-column");

    // Use displayName if available
    const author =
      post.uid === auth.currentUser?.uid
        ? auth.currentUser.displayName
        : "Anonymous";

    postDiv.innerHTML = `
      <h6 class="blog-topics-color mb-3">$</h6>
      <h2>${post.title}</h2>
      <p class="mt-2">${post.content}</p>
      <div class="d-flex flex-row gap-3 align-items-center">
        <span class="badge gray-dark">${author}</span>
        <p class="blog-topics-color mb-3">7 mins read</p>
        ${
          post.uid === auth.currentUser?.uid
            ? `  
          <button class="btn btn-warning btn-sm edit-button" data-post-id="${doc.id}">Edit</button>
          <button class="btn btn-danger btn-sm delete-button" data-post-id="${doc.id}">Delete</button>
        `
            : ""
        }
      </div>
    `;

    postsContainer.appendChild(postDiv);

    // Add event listener for edit button
    const editButton = postDiv.querySelector(".edit-button");
    if (editButton) {
      editButton.addEventListener("click", () => {
        editPost(editButton.dataset.postId); // Use the postId from data-post-id
      });
    }

    // Add event listener for delete button
    const deleteButton = postDiv.querySelector(".delete-button");
    if (deleteButton) {
      deleteButton.addEventListener("click", () => {
        deletePost(deleteButton.dataset.postId); // Use the postId from data-post-id
      });
    }
  });
};

// Display posts on user login
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user);
    displayPosts(); // Show posts when user is logged in
  } else {
    Swal.fire({
      icon: "info",
      title: "Not Logged In",
      text: "Please log in to create or view posts.",
    });
  }
});

// Form submit to create a post
createPostForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();

  if (!title || !content) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please fill out all fields!",
    });
    return;
  }

  try {
    const user = auth.currentUser;
    if (!user) {
      Swal.fire({
        icon: "info",
        title: "Authentication Required",
        text: "Please log in or sign up to create a post.",
      });
      return;
    }

    const authorName = user.displayName || "Anonymous";

    await addDoc(collection(db, "posts"), {
      title,
      content,
      timestamp: serverTimestamp(),
      author: authorName,
      uid: user.uid,
    });

    // Show success SweetAlert and hide the modal
    Swal.fire({
      icon: "success",
      title: "Post Created!",
      text: "Your post has been added successfully.",
    }).then(() => {
      // Hide the modal after the SweetAlert closes
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("createPostModal")
      );
      modal.hide();

      // Optionally, reset the form and display the new posts
      createPostForm.reset();
      displayPosts();
    });
  } catch (error) {
    console.error("Error adding post:", error);
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "There was an error adding your post. Please try again.",
    });
  }
});

// Function to edit a post
const editPost = (postId) => {
  const postRef = doc(db, "posts", postId);
  getDoc(postRef).then((docSnap) => {
    if (docSnap.exists()) {
      const post = docSnap.data();
      document.getElementById("postTitle").value = post.title;
      document.getElementById("postContent").value = post.content;

      // Show the modal after filling in the post data
      const modal = new bootstrap.Modal(document.getElementById("createPostModal"));
      modal.show(); // Show the modal

      // Update button behavior for updating the post
      createPostForm.removeEventListener("submit", createPostHandler); // Remove old event listener
      createPostForm.addEventListener("submit", (e) => updatePostHandler(e, postId)); // Add new update handler
    }
  });
};



// Function to handle post update
const updatePostHandler = async (e, postId) => {
  e.preventDefault();

  const title = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();

  if (!title || !content) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please fill out all fields!",
    });
    return;
  }

  const postRef = doc(db, "posts", postId);
  try {
    await updateDoc(postRef, { title, content, timestamp: serverTimestamp() });
    Swal.fire({
      icon: "success",
      title: "Post Updated!",
      text: "Your post has been updated successfully.",
    });

    createPostForm.reset();
    displayPosts();

    const modal = new bootstrap.Modal(
      document.getElementById("createPostModal")
    );
    modal.hide();
  } catch (error) {
    console.error("Error updating post:", error);
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "There was an error updating your post. Please try again.",
    });
  }
};

// Function to delete a post
const deletePost = async (postId) => {
  const postRef = doc(db, "posts", postId);
  try {
    await deleteDoc(postRef);
    Swal.fire({
      icon: "success",
      title: "Post Deleted!",
      text: "Your post has been deleted successfully.",
    });
    displayPosts();
  } catch (error) {
    console.error("Error deleting post:", error);
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "There was an error deleting your post. Please try again.",
    });
  }
};

// Modal initialization
const modal = new bootstrap.Modal(document.getElementById("createPostModal"));
modal.show();

// logout
let logOut=document.getElementById("LogOut")
logOut.addEventListener("click",(e)=>{
    signOut(auth).then(() => {
        console.log("user logout successfully");
        
       }).catch((error) => {
       console.log(error);
       
       });
})