document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-details-view').style.display = 'none';
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

  display_container.addEventListener("click", function() {
    load_email(email_json["id"]); // I may want to just pass the json
  });

  return display_container;

}

function load_email(email_id) {

  fetch('/emails/' + email_id)
  .then(response => response.json())
  .then(email => {

    document.querySelector('#email-subject').innerHTML = email["subject"];
    document.querySelector('#email-sender').innerHTML = 'From: ' + email["sender"];
    document.querySelector('#email-recipients').innerHTML = 'To: ' + email["recipients"];
    document.querySelector('#email-timestamp').innerHTML = 'Sent: ' + email["timestamp"];
    document.querySelector('#email-body').innerHTML = email["body"];

  })

  // Show email details view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-details-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  fetch('/emails/' + email_id, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
  

}

function load_mailbox(mailbox) {

  // Request the emails from the desired mailbox
  fetch('/emails/' + mailbox)
  .then(response => response.json())
  .then(emails => {
    console.log(emails)

    const emails_list = document.querySelector('#emails-view');
    for (let i = 0; i < emails.length; i++) {

      emails_list.appendChild(create_email_list_element(emails[i]));

    }
  })
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-details-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}

function send_email(event) {

  console.log('form submission');
  event.preventDefault();

  // Collect all the email information
  let email_recipients = document.querySelector('#compose-recipients').value;
  let email_subject = document.querySelector('#compose-subject').value;
  let email_body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: email_recipients,
        subject: email_subject,
        body: email_body
    })
  })
  .then(response => response.json())
  .then(result => {
      
      console.log(result);
      // I should probably try to handle errors here
  });

  load_mailbox('inbox');
  
  return false;

}