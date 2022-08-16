'use strict';

document.addEventListener('DOMContentLoaded', ( )=>{

    // Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabContent = document.querySelectorAll('.tabcontent'),
          tabParent = document.querySelector('.tabheader__items');
    
    function hideTabContent (){
        tabContent.forEach(item=>{
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
            console.log(item);
        });    
        tabs.forEach(item =>{
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent (i=0) {
        tabContent[i].classList.add('show', 'fade');
        tabContent[i].classList.remove('hide');        
        tabs[i].classList.add('tabheader__item_active');
    }

    tabParent.addEventListener('click',(event)=>{

        if (event.target && event.target.classList.contains('tabheader__item')) {

            tabs.forEach((item, i)  =>{
                if( item == event.target){
                    hideTabContent ();
                    showTabContent (i);
                }

            });
        }
    });    
    hideTabContent ();
    showTabContent ();

    // Timer


    const deadLine='2022-07-25';
        //   timer = document.querySelector(".timer"),
        //   blocks = timer.querySelectorAll('.timer__block');
    

    function getTimeRemaining(endTime){
        const t =Date.parse(endTime)-Date.parse(new Date()),
        days = Math.floor(t/(1000*60*60*24)) ,
        hours = Math.floor((t/(1000*60*60))%24),
        minutes = Math.floor((t/(1000*60))%60),
        seconds = Math.floor(t/1000%60);

        return {
            'total':t,
            'days':days,
            'hours': hours,
            'minutes': minutes,
            'seconds':seconds
        };
        // console.log(t);
    }

    function getZero(num){
        if (num>=0&& num <10){
            return `0${num}`;
        }else {
            return num;
        }

    }

    function setClock(selector,endtime){
        const timer = document.querySelector(selector),
        days = timer.querySelector('#days'),
        hours = timer.querySelector('#hours'),
        minutes= timer.querySelector('#minutes'),
        seconds = timer.querySelector('#seconds'),
        timeInterval = setInterval(updateClock, 1000);
      
        updateClock();
        // console.log( days.innerHTML);
        function updateClock(){
            const t =  getTimeRemaining(endtime);

            days.innerHTML=getZero(t.days);
            hours.innerHTML=getZero(t.hours);
            minutes.innerHTML=getZero(t.minutes);
            seconds.innerHTML=getZero(t.seconds);

            if (t.total<=0){
                clearInterval(days.innerHTML);
            }


            // console.log( t.seconds);

        }
    }
    // getTimeRemaining(deadLine);
    setClock('.timer',deadLine);
    


    // Modal

    const modalTriger =document.querySelectorAll('[data-modal]'),
    modal=document.querySelector('.modal');



    function openModal (){
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow ='hidden';
        clearInterval(modalTimerId);
    }

    modalTriger.forEach(btn =>{
        btn.addEventListener('click', openModal);
    });
    

    function closeModal(){
        modal.classList.add('hide');
        modal.classList.remove('show');    
        document.body.style.overflow ='';  
    }

  

    modal.addEventListener('click', (e)=>{
        if(e.target=== modal || e.target.getAttribute('data-close')==''){
            closeModal();   
            
        }
    });

    document.addEventListener('keydown', (e)=>{
        if(e.code==='Escape'&& modal.classList.contains('show')){
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 50000);


    function showModalByScroll (){
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);


    // form
    const forms = document.querySelectorAll('form');
    const message = {

        loading:'img/form/spinner.svg',
        successs:'success',
        failure: 'errer'
    };

    forms.forEach(item =>{
        postData(item);
    });


    function postData (form){
        form.addEventListener('submit', (e) =>{
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src=message.loading;
            statusMessage.style.cssText=`
                display:block;
                margin: 0 auto;
            `;
            //form.append(statusMessage);
            form.insertAdjacentElement('afterend', statusMessage);

            const request=new XMLHttpRequest();
            request.open('POST' , 'server.php');

            request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            const formData = new FormData(form);
            //request.send(formData);

            const object ={};
            formData.forEach(function(value, key){
                object[key]=value;
            });

            const json = JSON.stringify(object);
            request.send(json);
            

            request.addEventListener('load', ()=>{
                if (request.status===200){
                    console.log(request.response);
                    showThanksModal(message.successs);
                    //statusMessage.textContent=message.successs;
                    
                    statusMessage.remove();
                    form.reset();
                }else{
                    showThanksModal(message.failure);
                }
            });


        });
    }

    function showThanksModal(message){
        const prevModalDialog=document.querySelector(".modal__dialog");
        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class="modal__content">
            <div class = "modal__close" data-close>×</div>
            <div class = "modal_title">${message}</div>
        </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(()=>{
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
        
        
    }


});




  



  