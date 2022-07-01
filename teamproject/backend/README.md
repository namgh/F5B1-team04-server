# CU2 project

#### project 기간 : 3/17 ~ 4/4

#### 목차
1. 기획의도
2. 사용기술 스택
3. 데이터 흐름도
4. data flow
5. erd
6. api명세서
7. api
### 1. 기획의도

초보 개발자의 Self Study Solution을 제공하는 CU2 입니다.
CU2는 커뮤니티 서비스 CodingUs 와 멘토링 서비스 CoachingUs 로 Self Study Solution을 제공하여 초보 개발자를 성장시킬 수 있습니다.

앞서 CU2 서비스 이용자는 Us로 불리며 UsMember(일반 유저)와 UsCoach(코치 유저)로 나눠집니다.

‘내가 잘 하고 있는건가?’를 지속적으로 확인할 수 있도록 CU2의 모든 활동에는 점수가 부여됩니다. CodingUs에서는 블로그와 Q&A 콘텐츠를, CoachingUs는 코칭과 칼럼 콘텐츠를 생산과 소비할 수 있습니다. 콘텐츠를 생산하는 Us는 점수를 획득할 수 있고, 콘텐츠를 소비하는 Us는 점수를 줄 수 있습니다.

만일, 블로그에서 공부한 내용을 작성한다면 작성에 대한 보상으로 점수를 획득할 것입니다. 이후에는 누군가에게는 도움이 되는 글, 혹은 잘못된 정보를 전달하는 글이 될 것입니다. 이는 콘텐츠를 소비하는 사람들이 정하며 👍 좋아요와 👎 싫어요 로 지속적으로 점수가 변동될 것입니다. 이는 블로그 외 Q&A, 코칭과 칼럼 모두 동일하게 적용됩니다. 본인의 활동에 점수라는 지표로 지속적인 피드백을 받아 잘 하고 있는지를 파악할 수 있게 됩니다.

이후의 CoachingUs에서는 개발자로의 시작, 전환을 위한 취업 지원 콘텐츠를 제공합니다. CodingUs에서는 UsYouth와 UsCoach의 활동 영역이 동일하나 CoachingUs에서는 달라집니다. UsMember는 결제하여 본인의 자기소개서나 포트폴리오 등 취업 코칭을 신청하며 UsCoach는 코칭을 진행하며 대가를 받습니다. 칼럼은 코치가 재량으로 작성하는 글로, UsMember의 블로그보다 조금 더 전문적인 인사이트를 얻을 수 있으며 UsCoach 본인을 PR할 수 있는 콘텐츠입니다.



### 2.사용기술 스택

---
javascript, typescript

node, nestjs, typeorm, graphql

elasticsearch,logstash

mysql, redis

docker, git, discord, notion, github


### 3.DATA 흐름도

---
![](/teamproject/backend/img/pipe.png)
### 4.DATA FLOW

---
![](/teamproject/backend/img/flow.png)

### 5.ERD

---
![](/teamproject/backend/img/erd.png)

### 6.api 명세서

---
![]()

### 7.api

---
#### Sing up

회원가입 정보를 받은 후 비밀번호는 bycrypt 를 사용하여 hash하여 저장


`const hashedPassword = await bcrypt.hash(password, 10);`

휴대폰 인증을 위해서 NHN Cloud Service를 사용.
6자리의 랜덤 번호를 생성하고 휴대전화번호에 전송을 하게됩니다.
인증확인을 위해 redis 에 저장을 하고, 아직 시간이 남은 인증번호일 경우 삭제 후 다시 보내게 됩니다.
키-값 을 휴대전화번호-토큰번호로 redis에 저장을 하였습니다.
```ts
const token = String(Math.floor(Math.random() * 10 ** 6)).padStart(6, '0');

    const appKeys = process.env.SMS_APP_KEY;
    const XSecretKey = process.env.SMS_X_SECRET_KEY;
    const sender = phonenumber;
    await axios.post(
      `https://api-sms.cloud.toast.com/sms/v3.0/appKeys/${appKeys}/sender/sms`,
      {
        body: `안녕하세요. 인증번호는 ${token}입니다`,
        sendNo: '01065474238',
        recipientList: [
          {
            internationalRecipientNo: sender,
          },
        ],
      },
      {
        headers: {
          'X-Secret-Key': XSecretKey,
          'Content-Type': 'application/json;charset=UTF-8',
        },
      },
    );
    const redistoken = await this.cacheManager.get(phonenumber);
    if (redistoken) await this.cacheManager.del(phonenumber);
    await this.cacheManager.set(phonenumber, token, {
      ttl: 180,
    });
    return `${phonenumber} 으로 ${token}을 전송했습니다`;
```

![](/teamproject/backend/img/nhn.jpeg)

기존에 저장되어 있는지 휴대번호로 인증번호를 확인.
Boolean값으로 리턴.
```ts
    const redistoken = await this.cacheManager.get(phonenumber);

    if (redistoken === token) {
      await this.cacheManager.del(phonenumber);
      return true;
    }
    return false;
```

인증번호가 맞다면 true값을 반환, 틀리거나 3분이 지났다면 false를 반환합니다.
```ts
{
  "data": {
    "checktoken": true
  }
}
```
인증이 끝난 후 회원가입이 됩니다.

#### Login

bycrypt compare로 비밀번호를 확인
틀릴경우 UnauthorizedException로 401에러를 반환합니다.
```ts
    const isAuthenticated = await bcrypt.compare(password, user.password); //user.password - 해쉬된 비밀번호
    if (!isAuthenticated)
      throw new UnauthorizedException('비밀번호가 틀렸습니다!!!');

```

로그인이 되면 JWT를 이용하여 AccessToken, RefreshToken을 발급합니다
accesstoken 을 반환해주고
```ts
{
  "data": {
    "login": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IjEiLCJzdWIiOiI5NjdjOTNmOS0xNjNiLTQ4Y2MtYTAyYS02ZDE2ZWFhNTFiZjEiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTY1NjY2MzAxOCwiZXhwIjoxNjU2NjcwMjE4fQ._fG6eIGy9HxBgcMg5UrQVm-PTEgKbwk8JnwiUoKfffQ"
  }
}
```
refreshtoken 은 Access-Control-Allow-Origin 옵션을 사용해서 
header에 담아서 전송합니다.
```ts
   res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; path=/;domain=.cucutoo.com; SameSite=None; Secure; httpOnly;`,
    );
```
![](/teamproject/backend/img/cookie.png)


#### logout
로그아웃을 하면 redis에 accesstoken 과 refreshtoken값을 저장하여 
로그인 한 토큰이 다시 사용되었을 때 validate 에서 검증을 하도록 구성했습니다.

```ts
    await this.cacheManager.set(`accesstoken:${accesstoken}`, User, {
      ttl: User.exp,
    });
    return await this.cacheManager.set(`refreshToken:${refreshToken}`, User, {
      ttl: User.exp,
    });
```

```ts
async validate(req, payload) {
    const accesstoken = req.headers.authorization.replace('Bearer ', '');
    const check = await this.cacheManager.get(`accesstoken:${accesstoken}`);
    if (check) throw new UnauthorizedException('이미 로그아웃 되었습니다.');
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      exp: payload.exp,
    };
  }
```
로그아웃된 토큰을 다시 로그아웃 할 시 에러반환
```json
{
  "errors": [
    {
      "message": "이미 로그아웃 되었습니다.",
      "extensions": {
        "code": "UNAUTHENTICATED",
        "response": {
          "statusCode": 401,
          "message": "이미 로그아웃 되었습니다.",
          "error": "Unauthorized"
        }
      }
    }
  ],
  "data": null
}
```
#### search
검색어를 입력받아 elasticsearch를 사용하여 역색인 검색이 되도록 구성하였습니다.
entity 형식에 맞춰서 값을 반환하였습니다.

```ts
async fetchBlogSearch(@Args('search') search: string) {
    const result = await this.elasticsearchService.search({
      index: 'blog',
      query: {
        bool: {
          must: [{ match: { status: 'blog' } }],
          should: [
            { match_phrase: { title: search } }, //
            { match_phrase: { searchcontents: search } },
          ],
          minimum_should_match: 1,
        },
      },
    });

    if (!result.hits.hits.length) return [];
    //console.log(result.hits.hits)
    const resultmap = result.hits.hits.map((ele): any => {
      const temp = JSON.stringify(ele);
      const el = JSON.parse(temp);
      return {
        id: el._source.id,
        contents: el._source.contents,
        like: el._source.like,
        title: el._source.title,
        status: el._source.status,
        searchcontents: el._source.searchcontents,
        user: {
          email: el._source.email,
          nickname: el._source.nickname,
        },
        blogcategorytag: [
          {
            tag: el._source.tag,
          },
        ],
        updatedat: String(el._source.updatedat),
      };
    });
    return JSON.parse(JSON.stringify(resultmap));
  }
```

본문 내용 전체를 mysql에 저장을 하기때문에, 구분자와 같은 검색에 불필요한 단어들을 제거하기위해 filter를 사용
filter에서는 mutate 옵션 중 copy 를 사용하여 searchcontents를 추가 한 후
정규식을 사용하여 변환할 수 있는 gsub 옵션을 사용.

``` json
filter {

    if [type] == "blog"{
        mutate {
            add_field => {
                "status" => "blog"
            }
        }
    } 
    mutate { 
        copy => {
            "contents" => "searchcontents"
        }
    }
    mutate { 
        gsub => [  
            "searchcontents","!\[\]+[(]+[0-9a-zA-Z:/]+[)]","",
            "searchcontents"," {3,}","  ",
            "searchcontents","\`","",
            "searchcontents","\#{2,}","",
            "searchcontents","/n","",
            "searchcontents","http[0-9a-zA-Z:/.!?<>()]+[ ]",""
        ]
    }
}
```

document_id => "%{id}" 옵션을 사용해서 수정했을 때 같은 id값이 중복되지 않도록 설정
template를 하기 위해서 template 관련 옵션들을 사용
```json
output {
    if [type] == "blog" {
        elasticsearch {
            hosts => "elasticsearch:9200"
            index => "blog"
            document_id => "%{id}"
            manage_template => true 
            template_name => "cu"
            template => "/_templates/cu/template.json"
            template_overwrite => true
        }
            stdout { codec => rubydebug }
    }
}
```
stdout 옵션을 사용하여 아래와 같이 elasticsearch에 올라가는 데이터를 log로 확인 가능
contents 에 있는 구분자를 searchcontents에서는 제외하고 저장되는것을 확인할 수 있음.

```json
 {
               "like" => 0,
               "type" => "blog",
     "searchcontents" => "검색 테스트 ",
         "@timestamp" => 2022-07-01T09:18:00.468Z,
          "updatedat" => 1656667038.135285,
           "nickname" => "6",
                 "id" => "aaaf911f-9fc0-4c7c-ad4e-668aaa695153",
              "title" => "검색테스트",
             "status" => "blog",
                "tag" => "JS",
           "contents" => "검색 테스트 ![](Https://test)",
           "@version" => "1",
              "email" => "1"
 }
```

tokennizer를 ngram을 사용해서 포함된 단어도 검색 가능
```json
query
{
  fetchBlogSearch(search:"테스"){
    searchcontents
    title
  }
}
```

```json
{
  "data": {
    "fetchBlogSearch": [
      {
        "searchcontents": "검색 테스트 ",
        "title": "검색테스트"
      },
      {
        "searchcontents": "검색 테스트",
        "title": "search"
      }
    ]
  }
}
```

