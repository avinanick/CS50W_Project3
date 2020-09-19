document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function create_email_list_element(email_json) {

  let display_container = document.createElement('div');
  let sender = document.createElement('p');
  let subject = document.createElement('p');
  let timestamp = document.createElement('p');
  sender.setAttribute('class', 'email_sender');
  subject.setAttribute('class', 'email_subject');
  timestamp.setAttribute('class', 'email_time');

  sender.innerHTML = email_json["sender"];
  subject.innerHTML = email_json["subject"];
  timestamp.innerHTML = email_json["timestamp"];

  if (email_json["read"]) {

    display_container.setAttribute('class', 'read-email');

  } else {

    display_container.setAttribute('class', 'unread-email');

  }

  display_container.appendChild(sender);
  display_container.appendChild(subject);
  display_container.appendChild(timestamp);

  return display_container;

}

function load_email(email_id) {

}

function load_mailbox(mailbox) {

  // Request the emails from the desired mailbox
  fetch('/emails/${mailbox}')
  .then(response => response.json())
  .then(emails => {
    console.log(emails)
    setup_mailbox_display(emails)
  })
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}

function setup_mailbox_display(email_list) {

}