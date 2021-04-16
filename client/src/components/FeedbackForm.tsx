import React from 'react';
import emailjs from 'emailjs-com';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';

const FeedbackForm = () => {

    function sendEmail (e:any){
         e.preventDefault();

    emailjs.sendForm('service_xff4aj9', 'template_rc6pxwq', e.target, 'user_BsfvYr9KimVDL5GVUY5kV')
      .then((result:any) => {
          console.log(result.text);
      }, (error:any) => {
          console.log(error.text);
      });
    }


  return (
      <div>
          <div style={{padding:"10px"}}>
              <form onSubmit={sendEmail}>
                  <div style={{padding:"10px"}}>
                      <TextField  label="Navn"
                        variant="outlined"
                        rows={1}
                        multiline  
                        type="text"
                        name="name" />
                  </div>
                  <div style={{padding:"10px"}}>
                      <TextField  label="Email"
                        variant="outlined"
                        rows={1}
                        multiline  
                        type="email" 
                        placeholder="Email" 
                        name="email"/>
                  </div>
                  <div style={{padding:"10px"}}>
                      <TextField 
                        label="Emne"
                        variant="outlined"
                        rows={1}
                        multiline 
                        type="text" 
                        name="subject"/>
                  </div>
                  
                  <div style={{padding:"10px"}}>
                      <TextField 
                        label="Din melding"
                        variant="outlined"
                        multiline
                        type="text"
                        rows={8} 
                        name="message"></TextField>
                  </div>
                  <div>
                      <input type="submit" value="send message" placeholder="melding"/>
                  </div>
              </form>
          </div>
      </div>

       
  );
}

export default FeedbackForm;