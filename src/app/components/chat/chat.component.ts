import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {ChatService} from "../../services/chat.service";
import {DisplayType} from "../../shared/enums/display-type.enum";
import {Router} from "@angular/router";

class Message {
  text?: string;
  type: MessageType;
}

enum MessageType {
  Bot = 'bot',
  User = 'user',
  Loading = 'loading'
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer: ElementRef;
  @Input() public display: string;
  public displayType: DisplayType;
  public form: FormGroup;
  public messages: Array<Message> = [];
  private canSendMessage = true;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private chatService: ChatService){}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      message: ['']
    });
    console.log('messages: ', this.messages);
    if (this.messages.length === 0) {
      this.getBotMessage();
    }
    this.chatService.getMessages().subscribe(
      (message: any) => {
        console.log('message1  : ', message);
//        if (message?.type === MessageType.User) {
          this.messages.push({
            text: message,
            type: MessageType.Bot
          });
 //       }
      },
      (error) => console.error('Error receiving message:', error)
    );
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  public onClickSendMessage(): void {
    const message = this.form.get('message').value;
    console.log('message: ' , message);
    if (message && this.canSendMessage) {
      const userMessage: Message = {text: message, type: MessageType.User};
      this.messages.push(userMessage);
      this.chatService.sendMessage(userMessage.text , userMessage.type);
      this.form.get('message').setValue('');
      this.form.updateValueAndValidity();
      this.getBotMessage();
    }
  }

  private getBotMessage(): void {
    this.canSendMessage = false;
    const waitMessage: Message = {type: MessageType.Loading};
    this.messages.push(waitMessage);

    setTimeout(() => {
      this.messages.pop();
      const botMessage: Message = {text: 'Hello! How can I help you?', type: MessageType.Bot};
      if(!this.botMessageExist()) {
        this.messages.push(botMessage);
      }
      this.canSendMessage = true;
    }, 2000);
  }

  public onClickEnter(event: KeyboardEvent): void {
    event.preventDefault();
    this.onClickSendMessage();
  }

  private scrollToBottom(): void {
    this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
  }

  // tslint:disable-next-line:typedef
  botMessageExist() {
    return this.messages.find(message => message.type === MessageType.Bot);
  }

  openLargeChat() {
    console.log(this.router.url)
    if(this.router.url === '/fixed-chat'){
      // @ts-ignore
      this.router.navigate(['/collapsible-chat']);
    } else {
      this.router.navigate(['/fixed-chat']);
    }
  }
}
