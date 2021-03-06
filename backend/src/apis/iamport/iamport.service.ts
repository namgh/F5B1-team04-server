import {
  ConflictException,
  HttpException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class IamportService {
  async getImpAccessToken() {
    try {
      const result = await axios.post('https://api.iamport.kr/users/getToken', {
        imp_key: process.env.IMP_KEY,
        imp_secret: process.env.IMP_SECRET,
      });
      // console.log(`πIMP_access_token: ${result.data.response.access_token}`);
      return result.data.response.access_token;
    } catch (error) {
      // console.log(error); 
      throw new HttpException(
        error.response.data.message,
        error.response.status,
      );
    }
  }

  async checkPaid({ impUid, amount, access_token }) {
    try {
      const paidResult = await axios.get(
        `https://api.iamport.kr/payments/${impUid}`, //
        {
          headers: {
            Authorization: access_token,
          },
        },
      );
      // console.log(result.data.response);
      const data = paidResult.data.response;
      if (data.status !== 'paid')
        throw new ConflictException('κ²°μ  λ΄μ­μ΄ μ‘΄μ¬νμ§ μμ΅λλ€.');
      if (data.amount !== amount)
        throw new UnprocessableEntityException('κ²°μ  κΈμ‘μ΄ μλͺ»λμμ΅λλ€.');
    } catch (error) {
      // console.log(error);
      if (error?.response?.data?.message) {
        throw new HttpException(
          error.response.data.message,
          error.response.status,
        );
      } else {
        throw error;
      }
    }
  }

  async cancelPayment({ impUid: imp_uid, amount, access_token }) {
    try {
      const cancelResult = await axios.post(
        `https://api.iamport.kr/payments/cancel`, //
        {
          imp_uid,
          amount,
        },
        {
          headers: {
            Authorization: access_token,
          },
        },
      );

      if (cancelResult?.data?.message)
        throw new UnprocessableEntityException(cancelResult.data.message);
      if (cancelResult.data.response.cancel_amount !== amount)
        throw new UnprocessableEntityException('μ·¨μκΈμ‘μ΄ μΌμΉνμ§ μμ΅λλ€.');

      return cancelResult.data.response.cancel_amount;
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        throw new HttpException(
          error.response.data.message,
          error.response.status,
        );
      } else {
        throw error;
      }
    }
  }
}
