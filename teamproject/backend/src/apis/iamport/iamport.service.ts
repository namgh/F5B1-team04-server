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
      // console.log(`💛IMP_access_token: ${result.data.response.access_token}`);
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
        throw new ConflictException('결제 내역이 존재하지 않습니다.');
      if (data.amount !== amount)
        throw new UnprocessableEntityException('결제 금액이 잘못되었습니다.');
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
        throw new UnprocessableEntityException('취소금액이 일치하지 않습니다.');

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
