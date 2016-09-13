# Cервис для часов K911
>### Запуск сервиса
--------------------------------------
###### sudo node app.js
--------------------------------------
>### API
|                      Routes                |  HTTP Verb  |                 Description                     |
|--------------------------------------------|-------------|-------------------------------------------------|
| api/                                       | GET         | Get test API message                            |
| api/alarms                                 | GET         | Get all alarms                                  |
| api/alarms/:device_id                      | GET         | Get single alarm by device id                   |
| api/flower/:device_id/:count               | POST        | Send to watch number of hearts                  |
| api/upload/:device_id/:count               | POST        | Upload the data interval is set                 |
|api/centernumber/:device_id/:number         | POST        | Center number set up                            | 
| api/slavenumber/:device_id/:number         | POST        | Assist center number set up                     |
| api/controlpw/:device_id/:password         | POST        | Control password set up                         | 
| api/outcalls/:device_id/:number            | POST        | Outgoing calls                                  |
| api/setsos/:device_id/:number1             | POST        | First SOS number set up                         |
| api/setsos/:device_id/:number2             | POST        | Second SOS number set up                        |
| api/setsos/:device_id/:number3             | POST        | Third SOS number set up                         |
| api/setsos/:device_id/:num1/:num2/:num3    | POST        | SOS numbers set at the same time                |
| api/setting/:device_id/:ip/:ports          | POST        | IP port settings                                | 
| api/factory/:device_id                     | POST        | Restore factory settings                        | 
| api/setting/:device_id/:language/:timezone | POST        | Set the language and time zone                  |
| api/sossms/:device_id/:switchs             | POST        | SOS SMS alarm switch                            |
| api/lowbattery/:device_id/:switchs         | POST        | Low battery alarm message switch                |
| api/poweroff/:device_id                    | POST        | The shutdown instructions                       |
| api/restart/:device_id                     | POST        | Restart watch                                   |
| api/pi/:device_id                          | POST        | Positioning instruction                         |
| api/bluetooth/:device_id/switchs           | POST        | Bluetooth control instruction                   |
| api/imei/:device_id/:number                | POST        | Set IMEI number                                 | 
| api/sms/:device_id/:switchs                | POST        | Terminal all sms switch (0: Close, 1: Open)     |
| api/auto_answ_control/:device_id/:switchs  | POST        | Automatic answering control (0: Close, 1: Open) |
| api/chpulse/:device_id                     | GET         | Check pulse                                     |
| ?                                          | POST        | Alarm clock set Instruction                     |
| api/display/:device_id/:message            | POST        | Phrases Display set instruction                 |
| api/find_watch/:device_id                  | POST        | Looking for a watch instruction                 | 
| api/setting/:device_id/:tsfrom1/:tsto1/    |             |                                                 |
|             :tsfrom2/:tsto2/:tsfrom3:/     | POST        | No disturbance time section set                 |
|             :tsto3/:tsfrom4/:tsto4         |             |                                                 |
| api/setting/:device_id/:sleeptimefrom/     | POST        | Sleep and rollver time detection settings       |
|             :sleeptimeto                   |             |                                                 |
| api/setting/:device_id/:walktimefrom1/     |             |                                                 |
|             :walktimeto1/:walktimefrom2/   | POST        | Walktime settings                               |
|             :walktimeto2/:walktimefrom3/   |             |                                                 |                           
|             :walktimeto3                   |             |                                                 |
| api/setting/:device_id/:worktime           | POST        | Set the working time                            |
| api/list/:device_id/:num1/:num2/           | POST        | White list set command                          |
|          :num3/:num4/:num5                 |             |                                                 |
|                                            |             |                                                 |

>### Description Methods and Parameters
>**alarms** - тревоги<br />
>**device_id** - id устройства<br />
>**flower** - сердечки		
>**сount** - количество				
>**upload** - задаваемый интервал ответа<br />
>**сenternumber** - головной номер<br />
>**number** - номер					
>**slavenumber** - вспомогательный номер<br />
>**сontrolpw** - управление паролем				
>**password** - пароль	
>**outcalls** - исходящие звонки<br />
>**setsos** - метод SOS задается на определенные номера, при тревоги набираются номера которые были заданны в настройках<br />		
>**number1** - первый номер для установки SOS<br />	
>**number2** - второй номер для установки SOS<br />
>**number3** - третий номер для установки SOS<br />
>**num1, num2, num3** - возможность установить SOS дя 3-х номеров одновременно<br /> 
>**setting** - метод настроек<br />	
>**ip** - адрес сервера<br /> 
>**ports** - порт сервера<br />
>**factory** - метод сброса настроек по умолчанию<br />				
>**language** - язык<br />
>**timezone** - часовой пояс<br />
>**sossms** - отправлять SOS на номер или нет<br />			
>**switchs** - параметр 0 или 1<br />		
>**lowbattery** - метод включает или отключает уведомление при низком заряде аккумулятора<br />	
>**poweroff** - выключить удаленно<br />		 	 	 		
>**restart** - перезагрузить терминал<br />				 	 	 		
>**рi** - разбудить(поднять) GPS модуль<br />
>**bluetooth** - включить или выключить bluetooth<br />  				 	 	 	
>**imei** - задать терминалу imei номер<br />
>**sms** - метод который включает или выключает смс уведомления<br />	
>**auto_answ_control** - настройка автоответчика<br /> 			
>**сhpulse** - получить данные о пульсе<br />				
>**display** - метод отправки сообщения на терминал max колличество символов 6, min - 3<br />	
>**message** - сообщение<br />
>**find_watch** - найти часы<br />				
>**tsfrom1** - c (в какое время не беспокоить)<br />
>**tsto1** - по (в какое время не беспокоить)<br />				
>**walktimefrom1** - с (в какое время считать шаги)<br />			
>**walktimeto1** - по (в какое время считать шаги)<br />		
>**worktime** - задать рабочее время в минутах (1, 2, 3 и т д)<br />
>**power** - параметр 0 или 1<br />		
>**list** - список номеров

