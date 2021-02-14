import got from 'got';
import * as FormData from 'form-data'; // * as 안하면 => TypeError: form_data_1.default is not a constructor
import { Injectable, Inject } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleOptions } from './mail.interface';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {
    // this.sendEmail('testing content'); // for test (nestjs 시작마다 이 함수 테스트하기 위해)
  }

  private async sendEmail(subject: string, content: string) {
    // nodejs에는 프론트처럼 fetch가 없어.
    // nodejs에서 리퀘스트하려면 모듈 설치해야함.

    // -F: form
    // curl -s --user 'api:YOUR_API_KEY' \
    //   https://api.mailgun.net/v3/YOUR_DOMAIN_NAME/messages \
    //   -F from='Excited User <mailgun@YOUR_DOMAIN_NAME>' \
    //   -F to=YOU@YOUR_DOMAIN_NAME \
    //   -F to=bar@example.com \
    //   -F subject='Hello' \
    //   -F text='Testing some Mailgun awesomeness!'

    const form = new FormData();
    form.append('from', this.options.fromEmail);
    form.append('to', 'deg9810@naver.com'); // mailgun에 신용카드 등록하면 아무사람에게나 보낼 수 있음
    form.append('subject', subject);
    form.append('text', content);

    const response = await got(
      `https://api.mailgun.net/v3/${this.options.domain}/messages`,
      {
        rejectUnauthorized: false,
        method: 'POST',
        headers: {
          // base64 형식으로 인코딩할 것이다.
          Authorization: `Basic ${Buffer.from(
            `api:${this.options.apiKey}`,
          ).toString('base64')}`,
        },
        body: form,
      },
    );
    // console.log(response);
  }

  sendVerificationEmail(code: string) {
    // 원래는 user email로 보내야하지만 현재는 필요없기 때문에
    this.sendEmail('Verify Your Email', `Code is ${code}`);
  }
}
