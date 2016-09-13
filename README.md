# Cервис для часов K911
>### Запуск сервиса
--------------------------------------
###### sudo node app.js
--------------------------------------
>### API
|                                           Routes                                                           |   HTTP Verb  |                 Description                     |
|------------------------------------------------------------------------------------------------------------|--------------|-------------------------------------------------|
| api/                                                                                                       | GET          | Get test API message                            |
| api/alarms                                                                                                 | GET          | Get all alarms                                  |
| api/alarms/:device_id                                                                                      | GET          | Get single alarm by device id                   |
| api/flower/:device_id/:count                                                                               | POST         | Send to watch number of hearts                  |
| api/upload/:device_id/:count                                                                               | POST         | Upload the data interval is set                 |
|api/centernumber/:device_id/:number                                                                         | POST         | Center number set up                            | 
| api/slavenumber/:device_id/:number                                                                         | POST         | Assist center number set up                     |
| api/controlpw/:device_id/:password                                                                         | POST         | Control password set up                         | 
| api/outcalls/:device_id/:number                                                                            | POST         | Outgoing calls                                  |
| api/setsos/:device_id/:number1                                                                             | POST         | First SOS number set up                         |
| api/setsos/:device_id/:number2                                                                             | POST         | Second SOS number set up                        |
| api/setsos/:device_id/:number3                                                                             | POST         | Third SOS number set up                         |
| api/setsos/:device_id/:num1/:num2/:num3                                                                    | POST         | SOS numbers set at the same time                |
| api/setting/:device_id/:ip/:ports                                                                          | POST         | IP port settings                                | 
| api/factory/:device_id                                                                                     | POST         | Restore factory settings                        | 
| api/setting/:device_id/:language/:timezone                                                                 | POST         | Set the language and time zone                  |
| api/sossms/:device_id/:switchs                                                                             | POST         | SOS SMS alarm switch                            |
| api/lowbattery/:device_id/:switchs                                                                         | POST         | Low battery alarm message switch                |
| api/poweroff/:device_id                                                                                    | POST         | The shutdown instructions                       |
| api/restart/:device_id                                                                                     | POST         | Restart watch                                   |
| api/pi/:device_id                                                                                          | POST         | Positioning instruction                         |
| api/bluetooth/:device_id/switchs                                                                           | POST         | Bluetooth control instruction                   |
| api/imei/:device_id/:number                                                                                | POST         | Set IMEI number                                 | 
| api/sms/:device_id/:switchs                                                                                | POST         | Terminal all sms switch (0: Close, 1: Open)     |
| api/auto_answ_control/:device_id/:switchs                                                                  | POST         | Automatic answering control (0: Close, 1: Open) |
| api/chpulse/:device_id                                                                                     | GET          | Check pulse                                     |
| ?                                                                                                          | POST         | Alarm clock set Instruction                     |
| api/display/:device_id/:message                                                                            | POST         | Phrases Display set instruction                 |
| api/find_watch/:device_id                                                                                  | POST         | Looking for a watch instruction                 | 
| api/setting/:device_id/:tsfrom1/:tsto1/:tsfrom2/:tsto2/:tsfrom3:/:tsto3/:tsfrom4/:tsto4                    | POST         | No disturbance time section set                 |
| api/setting/:device_id/:sleeptimefrom/:sleeptimeto                                                         | POST         | Sleep and rollver time detection settings       |
| api/setting/:device_id/:walktimefrom1/:walktimeto1/:walktimefrom2/:walktimeto2/:walktimefrom3/:walktimeto3 | POST         | Walktime settings                               |
| api/setting/:device_id/:worktime                                                                           | POST         | Set the working time                            |
| api/list/:device_id/:num1/:num2/:num3/:num4/:num5                                                          | POST         | White list set command                          |

>### Description Methods and Parameters
>**alarms** - тревоги
>**device_id** - id устройства
>**flower** - сердечки		
>**сount** - количество				
>**upload** - задаваемый интервал ответа 
>**сenternumber** - головной номер
>**number** - номер					
>**slavenumber** - вспомогательный номер
>**сontrolpw** - управление паролем				
>**password** - пароль	
>**outcalls** - исходящие звонки
>**setsos** - метод SOS задается на определенные номера, при тревоги набираются номера которые были заданны в настройках		
>**number1** - первый номер для установки SOS	
>**number2** - второй номер для установки SOS
>**number3** - третий номер для установки SOS
>**num1, num2, num3** - возможность установить SOS дя 3-х номеров одновременно 
>**setting** - метод настроек	
>**ip** - адрес сервера 
>**ports** - порт сервера
>**factory** - метод сброса настроек по умолчанию				
>**language** - язык
>**timezone** - часовой пояс
>**sossms** - отправлять SOS на номер или нет			
>**switchs** - параметр 0 или 1		
>**lowbattery** - метод включает или отключает уведомление при низком заряде аккумулятора	
>**poweroff** - выключить удаленно		 	 	 		
>**restart** - перезагрузить терминал				 	 	 		
>**рi** - разбудить(поднять) GPS модуль
>**bluetooth** - включить или выключить bluetooth  				 	 	 	
>**imei** - задать терминалу imei номер
>**sms** - метод который включает или выключает смс уведомления	
>**auto_answ_control** - настройка автоответчика 			
>**сhpulse** - получить данные о пульсе				
>**display** - метод отправки сообщения на терминал max колличество символов 6, min - 3	
>**message** - сообщение
>**find_watch** - найти часы				
>**tsfrom1** - c (в какое время не беспокоить)
>**tsto1** - по (в какое время не беспокоить)				
>**walktimefrom1** - с (в какое время считать шаги)			
>**walktimeto1** - по (в какое время считать шаги)		
>**worktime** - задать рабочее время в минутах (1, 2, 3 и т д)
>**power** - параметр 0 или 1		
>**list** - список номеров

