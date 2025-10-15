# Fish Wish

This project was build to retrieve wish messages in google sheet, then show them in the
form of fishes animation swimming in the ocean. And also can send wish message into google sheet
by custom forms in page.

## Setup

Forking the project. Open Command Prompt, then use the following command in the desire directory:

```bash
git clone https://github.com/<your-github-name>/fish-wish.git
```

Then, use the following command in cloned project folder to install modules:

```bash
npm install
```

## Changing Google Sheet for Storing Data

First, duplicate this goole sheet: https://docs.google.com/spreadsheets/d/1eTYD9DGdHLIaQqH1TSTBfRAF5HuXb1Plpvgg7_xZ-S8/edit?usp=sharing.
This method will also auto duplicate google forms for this sheet too.

(Duplicated google forms and google sheet, both must be share to public). 

In `src\app\ts\constant.ts` change `SHEET_ID` into your duplicated google sheet url ID.
You can find your google sheet ID in https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID

After that, go to duplicated google forms page. Open inspect tab, then go to `Network` (Wifi symbol).

Enter dummy data into your form (put the question title into the input for easier setting up).
PS. After finished setting up, you can manually delete dummy data in your google sheet.

Submit the form, then click at `formResponse` in table `Name`. You will find
the `entry.<INPUT_ID>`. These Entry ID will be use for setup custom form in web page.

Finally, go to `src\app\components\kratong_form\kratong_form.component.ts`. Change `form_sent_to_url` to your
duplicated google form url. Replace those Entry ID with your own ID.

Entry ID of `ชื่อผู้ส่ง` question for `sender_name`.
Entry ID of `kratong_des` question for `คำอวยพร`.
Entry ID of `kratong_pic_i` question for `ภาพกระทง`. 

## Automated Deploy

This project auto build and deploy to gh-pages branch after main branch updated.
Reject build on failed test.

## Unit Test

To execute unit tests with the Karma test runner, use the following command:

```bash
npm test
```
