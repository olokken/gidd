import React from 'react';
import emailjs from 'emailjs-com';


const Footer = () => {

    function sendEmail (e:any){
         e.preventDefault();

    emailjs.sendForm('gmail', 'template_rc6pxwq', e.target, 'user_BsfvYr9KimVDL5GVUY5kV')
      .then((result:any) => {
          console.log(result.text);
      }, (error:any) => {
          console.log(error.text);
      });
    }


  return (
      <div>
          <div>
              <form onSubmit={sendEmail}>
                  <div>
                      <input placeholder="name" />
                  </div>
                  <div>
                      <input placeholder="Email"/>
                  </div>
                  <div>
                      <input placeholder="Emne"/>
                  </div>
                  <div>
                      <input placeholder="melding"/>
                  </div>
              </form>
          </div>
      </div>

       
  );
}

export default Footer;