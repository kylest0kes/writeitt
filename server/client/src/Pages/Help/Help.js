import React from 'react';

import './Help.scss';

function Help() {
  return (
    <div class="help-container">
      <h1>Help Center</h1>
      
      <p class="help-intro">
          Welcome to the Writeitt Help Center! We're here to help you get the most out of your experience. 
          Below you'll find answers to the most common questions, along with some tips for getting started.
      </p>

      <h2>Getting Started</h2>

      <h3>What is Writeitt?</h3>
      <p>
          Writeitt is a community-driven platform where users can share and discover content within themed 
          communities called "Stories." Think of it as a space to connect, share ideas, and engage with 
          others who have similar interests.
      </p>

      <h3>How Do I Create an Account?</h3>
      <ol>
          <li>Click the <strong>"Sign Up"</strong> or <strong>"Register"</strong> button at the top of the page.</li>
          <li>Enter a valid <strong>Username</strong>, <strong>Email Address</strong>, and secure <strong>Password</strong>.</li>
          <li>Click <strong>"Create Account"</strong>. You may need to verify your email address before you can start posting.</li>
      </ol>

      <h3>How Do I Join a Story?</h3>
      <p>
          You don't need to "join" a Story to view its content! Simply navigate to the "Stories" page and 
          click on any Story that interests you. To create content, you will need to be a member of that 
          Story (unless it's set to public). Once you find a Story you like, look for the 
          <strong>"Join"</strong> or <strong>"Subscribe"</strong> button.
      </p>

      <h2>Managing Your Content</h2>

      <h3>Creating a Post</h3>
      <ol>
          <li>Navigate to the Story where you want to post.</li>
          <li>Click the <strong>"Create Post"</strong> button.</li>
          <li>Fill in the <strong>Title</strong> and <strong>Body</strong> of your post.</li>
          <li>If desired, you can also upload an image or video.</li>
          <li>Click <strong>"Submit"</strong> to publish your post to the Story.</li>
      </ol>

      <h3>Editing a Post</h3>
      <ul>
          <li>You can edit your own posts by clicking the <strong>"..."</strong> menu on the post and selecting <strong>"Edit Post."</strong></li>
          <li>You will only be able to edit posts that you have created.</li>
      </ul>

      <h3>Deleting a Post</h3>
      <ul>
          <li>To delete a post, click the <strong>"..."</strong> menu on your post and select <strong>"Delete Post."</strong></li>
          <li>
              <strong>Note:</strong> This action is permanent and cannot be undone. All associated comments 
              and votes will also be removed.
          </li>
      </ul>

      <h2>Interacting with the Community</h2>

      <h3>Voting on Posts and Comments</h3>
      <ul>
          <li>Use the <strong>upvote</strong> and <strong>downvote</strong> arrows to vote on content you find valuable or insightful.</li>
          <li>This helps the community identify the most popular and relevant content.</li>
      </ul>

      <h2>Safety and Guidelines</h2>

      <h3>Community Guidelines</h3>
      <p>We are committed to fostering a respectful and safe environment. By using Writeitt, you agree to:</p>
      <ul>
          <li>Be respectful of others.</li>
          <li>Avoid posting spam, offensive, or harmful content.</li>
          <li>Stay on-topic within each Story's theme.</li>
      </ul>


      <h2>Troubleshooting</h2>

      <h3>My Post Isn't Showing Up</h3>
      <ul>
          <li>Ensure you are <strong>logged in</strong> to your account.</li>
          <li>If you created a post, check that you successfully clicked <strong>"Submit."</strong> Refresh the page after a few seconds.</li>
          <li>If your post was deleted, it may have violated our community guidelines.</li>
      </ul>


      <hr />

      <p class="help-footer">
          Thank you for being a part of the Writeitt community!
      </p>
  </div>
  )
}

export default Help;