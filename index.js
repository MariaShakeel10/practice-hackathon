import {
  onAuthStateChanged,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  db, 
  collection,
  serverTimestamp,
  getDocs,
  doc,
  auth,
  signOut
} from "./firebase.js";

// Get the form element.......................................................
const createPostForm = document.getElementById("createPostForm");



//  displaying posts.............................................................
const displayPosts = async () => {
  const postsContainer = document.getElementById("display-posts");
  postsContainer.innerHTML = "";

  const postsSnapshot = await getDocs(collection(db, "posts"));
  postsSnapshot.forEach((doc) => {
    const post = doc.data();
    const postDiv = document.createElement("div");
    postDiv.classList.add("container", "mt-3", "d-flex", "flex-column");

    //  displayName if available
    const author =
      post.uid === auth.currentUser?.uid
        ? auth.currentUser.displayName
        : "Anonymous";
//generating the post
    postDiv.innerHTML = `
      <h6 class="blog-topics-color mb-3">$</h6>
      <h2>${post.title}</h2>
      <p class="mt-2">${post.content}</p>
      <div class="d-flex flex-row gap-3 align-items-center">
        <span class="badge gray-dark">${author}</span>
        <p class="blog-topics-color mb-3">7 mins read</p>
        ${post.uid === auth.currentUser?.uid
        ? `  
          <button class="btn btn-warning btn-sm edit-button" data-post-id="${doc.id}">Edit</button>
          <button class="btn btn-danger btn-sm delete-button" data-post-id="${doc.id}">Delete</button>
        `
        : ""
      }
      </div>
    `;

    postsContainer.appendChild(postDiv);



    // Add event listener for edit button...
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

// Display posts on user login.......................................................
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user);
    displayPosts(); // Display posts when the user logs in
  } else {
    Swal.fire({
      icon: "info",
      title: "Not Logged In",
      text: "Please log in to create or view posts.",
    });
  }
});

// Create a new post
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
//  displayName if available
    const authorName = user.displayName || "Anonymous";
// adding the post to the database
    await addDoc(collection(db, "posts"), {
      title,
      content,
      timestamp: serverTimestamp(),
      author: authorName,
      uid: user.uid,
    });

    // Show SweetAlert and hide the modal
    Swal.fire({
      icon: "success",
      title: "Post Created!",
      text: "Your post has been added successfully.",
    }).then(() => {
      // Hide the modal
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("createPostModal")
      );
      modal.hide();

      // Reset the form and display posts
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

// Function to edit a post.......................................................
const editPost = (postId) => {
  const postRef = doc(db, "posts", postId);
  // Fetch the post data
  getDoc(postRef).then((docSnap) => {
    if (docSnap.exists()) {
      const post = docSnap.data();
      document.getElementById("postTitle").value = post.title;
      document.getElementById("postContent").value = post.content;

      // Show the modal after filling in the post data
      const modal = new bootstrap.Modal(document.getElementById("createPostModal"));
      modal.show(); // Show the modal

      // Update button behavior for updating the post
      createPostForm.removeEventListener("submit", createPostHandler); // Remove the old handler
      createPostForm.addEventListener("submit", (e) => updatePostHandler(e, postId)); // Add new updated handler
    }
  });
};



// Function to update a post
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
// updating the post.......................................................
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

// Function to delete a post.......................................................
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

// logout.......................................................
let logOut = document.getElementById("LogOut")
logOut.addEventListener("click", (e) => {
  signOut(auth).then(() => {
    console.log("user logout successfully");

  }).catch((error) => {
    console.log(error);

  });
})


//.............................. Search filter for displaying posts.............................................

// Move this line after the searchBlogs function definition


const searchBlogs = async () => {
  const searchQuery = document.getElementById("search-input").value.trim().toLowerCase();

  // Early exit if the search query is empty
  if (!searchQuery) {
    displayPosts(); // Reload all posts
    return;
  }

  const postsContainer = document.getElementById("display-posts");
  postsContainer.innerHTML = ""; // Clear previous results

  try {
    // Query posts
    const postsSnapshot = await getDocs(collection(db, "posts"));
    const filteredPosts = [];

    postsSnapshot.forEach((doc) => {
      const post = doc.data();

      // Exclude default posts
      if (
        post.title === "Default Title 1" ||
        post.title === "Default Title 2" ||
        post.content === "Default content"
      ) {
        return; // Skip default posts
      }

      // Check if the post matches the search query (by title or author)
      if (
        post.title.toLowerCase().includes(searchQuery) ||
        (post.author && post.author.toLowerCase().includes(searchQuery))
      ) {
        filteredPosts.push({ id: doc.id, ...post });
      }
    });

    // Display results
    if (filteredPosts.length > 0) {
      filteredPosts.forEach((post) => {
        const postDiv = document.createElement("div");
        postDiv.classList.add("container", "mt-3", "d-flex", "flex-column");

        const author =
          post.uid === auth.currentUser?.uid
            ? auth.currentUser.displayName
            : post.author || "Anonymous";

        postDiv.innerHTML = `
          <h6 class="blog-topics-color mb-3">${post.timestamp?.toDate().toLocaleDateString() || "Unknown Date"
          }</h6>
          <h2>${post.title}</h2>
          <p class="mt-2">${post.content}</p>
          <div class="d-flex flex-row gap-3 align-items-center">
            <span class="badge gray-dark">${author}</span>
          </div>
        `;

        postsContainer.appendChild(postDiv);
      });
    } else {
      postsContainer.innerHTML = `<p>No posts found matching "${searchQuery}".</p>`;
    }
  } catch (error) {
    console.error("Error searching posts:", error);
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "There was an error while searching for posts. Please try again.",
    });
  }
};

document.getElementById("search-button").addEventListener("click", searchBlogs);

