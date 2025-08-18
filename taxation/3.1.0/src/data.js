const data = {
  "dbName": "taxation",
  "tables": [
    {
      "name": "files",
      "primaryKey": "id",
      "cols": [
        {
          "name": "id",
          "type": "string",
          "note": "ファイルのID"
        },
        {
          "name": "name",
          "type": "string",
          "note": "ファイル(フォルダ)名"
        },
        {
          "name": "mime",
          "type": "string",
          "note": "MIMEタイプ。例:\"application/pdf\",\"application/vnd.google-apps.spreadsheet\""
        },
        {
          "name": "desc",
          "type": "string",
          "note": "ファイルの説明。「詳細を表示>詳細タグ>ファイルの詳細>説明」に設定された文字列"
        },
        {
          "name": "url",
          "type": "string",
          "note": "ファイルのURL。File.getDownloadUrl()ではなくFile.getUrl()"
        },
        {
          "name": "viewers",
          "type": "string",
          "note": "閲覧権限を持つアカウント"
        },
        {
          "name": "editors",
          "type": "string",
          "note": "編集権限を持つアカウント"
        },
        {
          "name": "created",
          "type": "string",
          "note": "作成日時。ISO8601拡張形式"
        },
        {
          "name": "updated",
          "type": "string",
          "note": "更新日時。ISO8601拡張形式"
        }
      ],
      "initial": "() => getFileList()",
      "data": [
        {
          "id": "1ATSxdgmIT1ZxIoXQrPTdeMGPNeDBCEcx7UC29FF2FcM",
          "name": "開発用",
          "mime": "application/vnd.google-apps.spreadsheet",
          "desc": "",
          "url": "https://docs.google.com/spreadsheets/d/1ATSxdgmIT1ZxIoXQrPTdeMGPNeDBCEcx7UC29FF2FcM/edit?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-08-13T12:22:14.243+09:00",
          "updated": "2025-08-16T13:06:16.918+09:00"
        },
        {
          "id": "1ydJXUwV6bwA6SgMoy1rkalemzPhtj-G9",
          "name": "20250605_固都税納税通知書.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1ydJXUwV6bwA6SgMoy1rkalemzPhtj-G9/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-08-16T12:59:57.122+09:00",
          "updated": "2025-08-16T13:00:20.430+09:00"
        },
        {
          "id": "1sk5K2tTHlsoTCuxRCIEEstGJRWSqYbvD",
          "name": "SMTLF202501.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1sk5K2tTHlsoTCuxRCIEEstGJRWSqYbvD/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T16:46:14.539+09:00",
          "updated": "2025-08-14T15:25:40.641+09:00"
        },
        {
          "id": "1KaaezOsQMobZORAwm9-73788r48tRASRECfmOfXvWxc",
          "name": "証憑2024",
          "mime": "application/vnd.google-apps.spreadsheet",
          "desc": "",
          "url": "https://docs.google.com/spreadsheets/d/1KaaezOsQMobZORAwm9-73788r48tRASRECfmOfXvWxc/edit?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2024-10-06T10:43:32.456+09:00",
          "updated": "2025-08-14T11:16:16.315+09:00"
        },
        {
          "id": "1HU9QwTQksztT9wSTMT8nLtXsjqmOKqtD",
          "name": "YFP202506.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1HU9QwTQksztT9wSTMT8nLtXsjqmOKqtD/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-08-14T10:58:14.851+09:00",
          "updated": "2025-08-14T10:58:18.028+09:00"
        },
        {
          "id": "1SH_Dmi7sl-b3K0b6JyYacoF_X_shXFki",
          "name": "YFP202409.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1SH_Dmi7sl-b3K0b6JyYacoF_X_shXFki/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-08-14T10:17:12.839+09:00",
          "updated": "2025-08-14T10:17:15.141+09:00"
        },
        {
          "id": "1EqlDPWySpl0iJ1anZ2sPeLeTUA2Rw0_J",
          "name": "YFP202410.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1EqlDPWySpl0iJ1anZ2sPeLeTUA2Rw0_J/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-08-14T10:17:06.485+09:00",
          "updated": "2025-08-14T10:17:08.913+09:00"
        },
        {
          "id": "1Ua8KL7FOFa5r6TcrYKcCYk6ZZL-XZeZm",
          "name": "YFP202411.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1Ua8KL7FOFa5r6TcrYKcCYk6ZZL-XZeZm/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-08-14T10:17:00.223+09:00",
          "updated": "2025-08-14T10:17:02.922+09:00"
        },
        {
          "id": "1K6ufCGu1AmnHFp9V1MKlo3yvwFgXCC5m",
          "name": "YFP202412.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1K6ufCGu1AmnHFp9V1MKlo3yvwFgXCC5m/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-08-14T10:16:52.271+09:00",
          "updated": "2025-08-14T10:16:55.041+09:00"
        },
        {
          "id": "1me0ohvGnI0lMPbcF9YbBV5g-DnXepWwd",
          "name": "YFP202501.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1me0ohvGnI0lMPbcF9YbBV5g-DnXepWwd/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-08-14T10:16:45.555+09:00",
          "updated": "2025-08-14T10:16:48.436+09:00"
        },
        {
          "id": "1b1GCWvPM2BKaaQkk2HFKkQVl4tvxoFN-",
          "name": "YFP202502.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1b1GCWvPM2BKaaQkk2HFKkQVl4tvxoFN-/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-08-14T10:16:37.696+09:00",
          "updated": "2025-08-14T10:16:40.467+09:00"
        },
        {
          "id": "1IibZSOEiOoH8Q2qBAKeTubMlcTxi7faH",
          "name": "YFP202503.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1IibZSOEiOoH8Q2qBAKeTubMlcTxi7faH/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-08-14T10:16:31.736+09:00",
          "updated": "2025-08-14T10:16:34.055+09:00"
        },
        {
          "id": "1QYfQ1Du2uec2OHJNSI8AvZ7RcfTzAyvJ",
          "name": "YFP202504.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1QYfQ1Du2uec2OHJNSI8AvZ7RcfTzAyvJ/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-08-14T10:16:23.627+09:00",
          "updated": "2025-08-14T10:16:27.616+09:00"
        },
        {
          "id": "1tzZ7Cp4a1zRPMW-xP0WfURsIyWAAR06J",
          "name": "YFP202505.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1tzZ7Cp4a1zRPMW-xP0WfURsIyWAAR06J/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-08-14T10:16:16.139+09:00",
          "updated": "2025-08-14T10:16:19.067+09:00"
        },
        {
          "id": "10Ol1bQYSW6yJ-BhJA_4KFoBo69Nj4jSi",
          "name": "20250630_400_003.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/10Ol1bQYSW6yJ-BhJA_4KFoBo69Nj4jSi/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-07-15T12:07:55.000+09:00",
          "updated": "2025-08-12T11:11:32.717+09:00"
        },
        {
          "id": "1v5uFTtTkeaDcH6mPbFUGxrtWAK5qZBvG",
          "name": "20250630_400_000.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1v5uFTtTkeaDcH6mPbFUGxrtWAK5qZBvG/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-07-15T12:07:54.000+09:00",
          "updated": "2025-08-12T11:11:19.431+09:00"
        },
        {
          "id": "1BZNOm2xdiPGM0p-Lhc527IM9hph1Ieqc",
          "name": "20250531_400_003.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1BZNOm2xdiPGM0p-Lhc527IM9hph1Ieqc/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-06-13T14:30:05.000+09:00",
          "updated": "2025-08-12T11:10:58.811+09:00"
        },
        {
          "id": "1Qjtqp2ZeLh7pFEjrTemqIE9KQ4g9OYmc",
          "name": "20250531_400_000.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1Qjtqp2ZeLh7pFEjrTemqIE9KQ4g9OYmc/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-06-13T14:30:04.000+09:00",
          "updated": "2025-08-12T11:10:46.136+09:00"
        },
        {
          "id": "1bqN3KjAQiYslnm8kuSrf1OZWC7sltXBS",
          "name": "MUFG10.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1bqN3KjAQiYslnm8kuSrf1OZWC7sltXBS/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-08-12T11:07:44.052+09:00",
          "updated": "2025-08-12T11:06:58.000+09:00"
        },
        {
          "id": "1uvIX0nbDpNNTD3DAC5qlmqPOkpXjBAJU",
          "name": "202509.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1uvIX0nbDpNNTD3DAC5qlmqPOkpXjBAJU/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-08-12T10:56:47.320+09:00",
          "updated": "2025-08-12T10:56:14.000+09:00"
        },
        {
          "id": "1fbnOnZfXP8668DFDgYsmqMY3-Kzop4TP",
          "name": "202508.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1fbnOnZfXP8668DFDgYsmqMY3-Kzop4TP/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-08-12T10:56:47.134+09:00",
          "updated": "2025-08-12T10:55:47.000+09:00"
        },
        {
          "id": "1VfYA1UXAfWqVru40gsAdqNy---F9m7fw",
          "name": "202507.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1VfYA1UXAfWqVru40gsAdqNy---F9m7fw/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-08-12T10:56:47.221+09:00",
          "updated": "2025-08-12T10:55:14.000+09:00"
        },
        {
          "id": "1OnRJfOJZyx_H4OImAUk7n36ThfHYcvCP",
          "name": "note202423.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1OnRJfOJZyx_H4OImAUk7n36ThfHYcvCP/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-08-12T10:34:13.441+09:00",
          "updated": "2025-08-12T10:27:25.000+09:00"
        },
        {
          "id": "1PmiDSvK2mGQ--0ZWWBPXNkmkbW_AuR5j",
          "name": "note202422.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1PmiDSvK2mGQ--0ZWWBPXNkmkbW_AuR5j/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-08-12T10:34:13.566+09:00",
          "updated": "2025-08-12T10:27:21.000+09:00"
        },
        {
          "id": "1Rl56ZxfylcbvqHbSQNiGX2xxNQGKE0hX",
          "name": "SMBC07.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1Rl56ZxfylcbvqHbSQNiGX2xxNQGKE0hX/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-06-07T11:12:36.582+09:00",
          "updated": "2025-08-11T11:41:24.739+09:00"
        },
        {
          "id": "1_5eI2oZoBA34F6Yze5NF26lzYv8UB2o3",
          "name": "pension202507.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1_5eI2oZoBA34F6Yze5NF26lzYv8UB2o3/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-08-11T11:37:34.922+09:00",
          "updated": "2025-08-11T11:34:57.000+09:00"
        },
        {
          "id": "1BCvfJw33ipCWRutWkInN6nEFkyni3BSJ",
          "name": "pension202506.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1BCvfJw33ipCWRutWkInN6nEFkyni3BSJ/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-08-11T11:37:34.967+09:00",
          "updated": "2025-08-11T11:34:54.000+09:00"
        },
        {
          "id": "1jKJ_wkmKB_Rp5rY6hvS37O4TotVgnfZv",
          "name": "HS202507.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1jKJ_wkmKB_Rp5rY6hvS37O4TotVgnfZv/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-08-11T11:32:19.887+09:00",
          "updated": "2025-08-11T11:25:03.000+09:00"
        },
        {
          "id": "1Bun4eFNXtr7R_e9vz8yzoXfwLPDyNyyI",
          "name": "レシート（発行_ アース西東京）.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1Bun4eFNXtr7R_e9vz8yzoXfwLPDyNyyI/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-08-06T15:57:29.725+09:00",
          "updated": "2025-08-06T15:56:43.000+09:00"
        },
        {
          "id": "11zJApmPffEOonDyzbC376SMZOwW3KCvW",
          "name": "EF202507.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/11zJApmPffEOonDyzbC376SMZOwW3KCvW/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-07-12T16:53:14.523+09:00",
          "updated": "2025-07-12T14:54:00.000+09:00"
        },
        {
          "id": "1lFHpR9YhLIgECcKe9VB49BqJ9u5e0uPd",
          "name": "CK202507.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1lFHpR9YhLIgECcKe9VB49BqJ9u5e0uPd/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-07-12T16:53:12.102+09:00",
          "updated": "2025-07-12T14:53:32.000+09:00"
        },
        {
          "id": "1g3O_7tt7SBgD_-Ul2Yv9qEgndOWltMty",
          "name": "カメラのキタムラ - 注文番号：6-25070337767.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1g3O_7tt7SBgD_-Ul2Yv9qEgndOWltMty/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-07-06T16:08:15.995+09:00",
          "updated": "2025-07-06T16:07:45.000+09:00"
        },
        {
          "id": "1ZInZcnJ85y9RE2QhBJ0uXa0kCx5cGcVy",
          "name": "EF202505.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1ZInZcnJ85y9RE2QhBJ0uXa0kCx5cGcVy/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-07-04T16:37:44.024+09:00",
          "updated": "2025-07-04T16:36:00.000+09:00"
        },
        {
          "id": "11YcUIfTfdCYQyHZmvPvSEM2H5pG5w09P",
          "name": "CK202505.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/11YcUIfTfdCYQyHZmvPvSEM2H5pG5w09P/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-07-04T16:37:41.524+09:00",
          "updated": "2025-07-04T16:35:20.000+09:00"
        },
        {
          "id": "1QYqUsfl3mLaOXXgtvuIFBq8voNOjp_T3",
          "name": "note202420.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1QYqUsfl3mLaOXXgtvuIFBq8voNOjp_T3/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-06-03T10:29:31.045+09:00",
          "updated": "2025-06-12T17:13:14.155+09:00"
        },
        {
          "id": "1Wr_ZiVQuLzvldvstP2qKIVOgMnUIqtCB",
          "name": "note202419.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1Wr_ZiVQuLzvldvstP2qKIVOgMnUIqtCB/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-06-03T10:31:03.513+09:00",
          "updated": "2025-06-12T17:12:31.364+09:00"
        },
        {
          "id": "1dga4JN0wjyir1vKQWQMXyrTb8A2ttqrA",
          "name": "note202418.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1dga4JN0wjyir1vKQWQMXyrTb8A2ttqrA/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-06-12T17:11:16.162+09:00",
          "updated": "2025-06-12T17:08:55.000+09:00"
        },
        {
          "id": "1czqX_kp1hUc5MWjEMXWr52I4w0dwgyMa",
          "name": "note202417.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1czqX_kp1hUc5MWjEMXWr52I4w0dwgyMa/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-06-12T17:11:16.162+09:00",
          "updated": "2025-06-12T17:08:51.000+09:00"
        },
        {
          "id": "1qu15HlBEnuzPtSFHf79C_-2k1fqJIonk",
          "name": "note202416.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1qu15HlBEnuzPtSFHf79C_-2k1fqJIonk/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-06-12T17:11:15.191+09:00",
          "updated": "2025-06-12T17:08:28.000+09:00"
        },
        {
          "id": "1Bh59Atuyu4W6RxcIKRRZVLdn9uH9-hN4",
          "name": "note202415.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1Bh59Atuyu4W6RxcIKRRZVLdn9uH9-hN4/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-06-12T17:11:16.162+09:00",
          "updated": "2025-06-12T17:08:24.000+09:00"
        },
        {
          "id": "1JBVGIvDZAOc9dRbGhPnGkUNaDLM2KvgN",
          "name": "pension202505.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1JBVGIvDZAOc9dRbGhPnGkUNaDLM2KvgN/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-06-12T17:08:00.785+09:00",
          "updated": "2025-06-12T17:05:27.000+09:00"
        },
        {
          "id": "1EHDwN80tJprY1F9H27WLE0Vw16m5jU4e",
          "name": "pension202504.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1EHDwN80tJprY1F9H27WLE0Vw16m5jU4e/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-06-12T17:07:59.933+09:00",
          "updated": "2025-06-12T17:05:08.000+09:00"
        },
        {
          "id": "1HRuCoHLQUmZcoSYbpaghcQGnA9Og7EUk",
          "name": "20250430_400_003.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1HRuCoHLQUmZcoSYbpaghcQGnA9Og7EUk/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-05-15T15:32:51.000+09:00",
          "updated": "2025-06-12T16:58:50.084+09:00"
        },
        {
          "id": "1h6TzhFR0CvRLYBHxIv_AUj5Pul5YEYT7",
          "name": "20250430_400_000.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1h6TzhFR0CvRLYBHxIv_AUj5Pul5YEYT7/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-05-15T15:32:50.000+09:00",
          "updated": "2025-06-12T16:58:37.715+09:00"
        },
        {
          "id": "1w9jnnzjK9h4-n1OTf4hhzCXCFib3YFoP",
          "name": "20250331_400_000.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1w9jnnzjK9h4-n1OTf4hhzCXCFib3YFoP/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-04-15T14:37:41.000+09:00",
          "updated": "2025-06-12T16:58:09.367+09:00"
        },
        {
          "id": "1KRSOFGb4HqFElsWN7KC7I1ywD5VtWpqT",
          "name": "20250331_400_003.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1KRSOFGb4HqFElsWN7KC7I1ywD5VtWpqT/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-04-15T14:37:42.000+09:00",
          "updated": "2025-06-12T16:58:00.409+09:00"
        },
        {
          "id": "1kMz65n4DP3Ozo5vYpTVSirucydEbMv2Q",
          "name": "HS202506.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1kMz65n4DP3Ozo5vYpTVSirucydEbMv2Q/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-06-12T16:54:15.842+09:00",
          "updated": "2025-06-12T16:50:01.000+09:00"
        },
        {
          "id": "1IbOhlwhETkLTpD2bcMPLIpJgpP9aTY9T",
          "name": "HS202505.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1IbOhlwhETkLTpD2bcMPLIpJgpP9aTY9T/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-06-12T16:54:15.842+09:00",
          "updated": "2025-06-12T16:49:57.000+09:00"
        },
        {
          "id": "1CKUFUPi7eoLwwudlL8vGaEwjZX3dRr2u",
          "name": "HS202504.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1CKUFUPi7eoLwwudlL8vGaEwjZX3dRr2u/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-06-12T16:54:15.010+09:00",
          "updated": "2025-06-12T16:49:53.000+09:00"
        },
        {
          "id": "17bOhRz5xn7PLpa3bIxrs5LXDmrzU3bFh",
          "name": "note202421.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/17bOhRz5xn7PLpa3bIxrs5LXDmrzU3bFh/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-06-12T10:31:55.370+09:00",
          "updated": "2025-06-12T10:31:46.000+09:00"
        },
        {
          "id": "1-jIEuChTyB7W3TX8jqUShy9jzH9E0_Qq",
          "name": "202506.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1-jIEuChTyB7W3TX8jqUShy9jzH9E0_Qq/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-06-10T11:10:35.319+09:00",
          "updated": "2025-06-10T11:09:55.000+09:00"
        },
        {
          "id": "19MTD3X6tmQFwh3Wp2h2wCdyz0Njc-lHR",
          "name": "202505.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/19MTD3X6tmQFwh3Wp2h2wCdyz0Njc-lHR/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-06-10T11:10:34.636+09:00",
          "updated": "2025-06-10T11:08:58.000+09:00"
        },
        {
          "id": "12tBvomHwrTWzj7W6cFMiBf8xnvNyUFo8",
          "name": "CK202506.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/12tBvomHwrTWzj7W6cFMiBf8xnvNyUFo8/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-06-11T13:35:14.454+09:00",
          "updated": "2025-06-10T10:46:44.000+09:00"
        },
        {
          "id": "1Xh5cV-Z1zDUTXgiWKPuUvip9_NqEMbz1",
          "name": "EF202506.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1Xh5cV-Z1zDUTXgiWKPuUvip9_NqEMbz1/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-06-11T13:35:16.776+09:00",
          "updated": "2025-06-10T10:44:38.000+09:00"
        },
        {
          "id": "1DgiN-KZkGljLdogLRstsUokQ-l_tObbj",
          "name": "SMBC06.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1DgiN-KZkGljLdogLRstsUokQ-l_tObbj/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-06-07T11:17:06.390+09:00",
          "updated": "2025-06-07T11:20:12.335+09:00"
        },
        {
          "id": "1wTr5Xz7_UaNS2dv4SJviR72x_JXXSlF7",
          "name": "MUFG09.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1wTr5Xz7_UaNS2dv4SJviR72x_JXXSlF7/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-06-07T11:11:26.949+09:00",
          "updated": "2025-06-07T11:19:33.798+09:00"
        },
        {
          "id": "1uu_NH-iGsQYC21pVZS3vohIVfhYaJrn_",
          "name": "2025年度給与所得等に係る税額決定通知書.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1uu_NH-iGsQYC21pVZS3vohIVfhYaJrn_/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-06-03T10:26:56.810+09:00",
          "updated": "2025-06-03T10:26:01.000+09:00"
        },
        {
          "id": "1DaGH1LmErJ0Pc7gcz4uP8PHgP9xyorJC",
          "name": "20250531_領収書 _ 無印良品.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1DaGH1LmErJ0Pc7gcz4uP8PHgP9xyorJC/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-05-30T19:06:27.194+09:00",
          "updated": "2025-05-30T19:19:37.730+09:00"
        },
        {
          "id": "11pXYjxhKQIklRiAFQJNKQZ8JtpLUgKZC",
          "name": "20241025_スマホスタンド領収書.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/11pXYjxhKQIklRiAFQJNKQZ8JtpLUgKZC/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-05-30T19:14:39.096+09:00",
          "updated": "2025-05-30T19:14:09.000+09:00"
        },
        {
          "id": "1iLsevNUcaq9kp3rqCarZMwhG1HdFcgOL",
          "name": "20241206_スマホフィルム領収書.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1iLsevNUcaq9kp3rqCarZMwhG1HdFcgOL/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-05-31T11:29:14.080+09:00",
          "updated": "2025-05-30T19:13:12.000+09:00"
        },
        {
          "id": "1dEIdlcHtfkXresrJVvi7yqschZRA9N_W",
          "name": "20250125_ワイヤレスマウス領収書.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1dEIdlcHtfkXresrJVvi7yqschZRA9N_W/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-05-31T11:29:13.116+09:00",
          "updated": "2025-05-30T19:10:36.000+09:00"
        },
        {
          "id": "1A99DTWWEdXUq8KAFu-nq-hVuWer3T9WG",
          "name": "RC182643190.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1A99DTWWEdXUq8KAFu-nq-hVuWer3T9WG/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-05-30T11:23:16.009+09:00",
          "updated": "2025-05-30T11:22:16.000+09:00"
        },
        {
          "id": "1YamIvPbChf_wYt8lvs7wvWmQEQKdhL6D",
          "name": "RC182643445.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1YamIvPbChf_wYt8lvs7wvWmQEQKdhL6D/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-05-30T11:23:16.756+09:00",
          "updated": "2025-05-30T11:21:28.000+09:00"
        },
        {
          "id": "1kdiuk2zTVwL9BAKBocuyCj5HltUvKDF-",
          "name": "RC182722417.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1kdiuk2zTVwL9BAKBocuyCj5HltUvKDF-/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-05-30T11:23:16.756+09:00",
          "updated": "2025-05-30T11:20:15.000+09:00"
        },
        {
          "id": "1xXxbijwGf65A75_BV54jjEQWBzYf8uss",
          "name": "20250421_SMBCローン返済明細書.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1xXxbijwGf65A75_BV54jjEQWBzYf8uss/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-04-28T15:14:03.993+09:00",
          "updated": "2025-04-28T15:11:30.000+09:00"
        },
        {
          "id": "1niqoqRwcbwxmKAJpXMTw8b9RquCm_1RJ",
          "name": "CK202504.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1niqoqRwcbwxmKAJpXMTw8b9RquCm_1RJ/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-04-11T11:07:53.984+09:00",
          "updated": "2025-04-10T10:39:32.000+09:00"
        },
        {
          "id": "1RzMfno62JFt-1O6pzP3d4kP033qEEqiP",
          "name": "EF202504.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1RzMfno62JFt-1O6pzP3d4kP033qEEqiP/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-04-11T11:07:56.217+09:00",
          "updated": "2025-04-10T10:39:06.000+09:00"
        },
        {
          "id": "1Bc1ZAMHhib6spfk-bGnUhRamFZOzAXDx",
          "name": "Amazon.co.jp - 注文番号 249-7275815-9909431.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1Bc1ZAMHhib6spfk-bGnUhRamFZOzAXDx/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-04-08T15:14:27.707+09:00",
          "updated": "2025-04-08T15:14:13.000+09:00"
        },
        {
          "id": "1yyrL-IT8GGBXOmq_p1tNZ8jSXw4JrlVs",
          "name": "note202414.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1yyrL-IT8GGBXOmq_p1tNZ8jSXw4JrlVs/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-04-08T10:51:04.657+09:00",
          "updated": "2025-04-08T10:48:36.000+09:00"
        },
        {
          "id": "1Szu26rRcExiBzp9tYA01zM2qBqN6TPbb",
          "name": "note202413.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1Szu26rRcExiBzp9tYA01zM2qBqN6TPbb/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-04-08T10:51:03.750+09:00",
          "updated": "2025-04-08T10:48:32.000+09:00"
        },
        {
          "id": "1GPAAeyG11pNQuxCrXkHzD1fhUXbGRinj",
          "name": "note202412.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1GPAAeyG11pNQuxCrXkHzD1fhUXbGRinj/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-04-08T10:51:05.741+09:00",
          "updated": "2025-04-08T10:48:28.000+09:00"
        },
        {
          "id": "1306vItumI12s6by6tz3tdtQoAkJ_yhhz",
          "name": "note202411.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1306vItumI12s6by6tz3tdtQoAkJ_yhhz/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-04-08T10:51:04.657+09:00",
          "updated": "2025-04-08T10:48:25.000+09:00"
        },
        {
          "id": "1UFKtlLe18F8Bn4GsJYJXMF5IIbEGmErU",
          "name": "note202410.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1UFKtlLe18F8Bn4GsJYJXMF5IIbEGmErU/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-04-08T10:51:05.741+09:00",
          "updated": "2025-04-08T10:48:23.000+09:00"
        },
        {
          "id": "1lmP0_Xm1QqJJGOEWd4uM4QIYa4ddLbpV",
          "name": "pension202503.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1lmP0_Xm1QqJJGOEWd4uM4QIYa4ddLbpV/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-04-08T10:40:25.730+09:00",
          "updated": "2025-04-08T10:39:54.000+09:00"
        },
        {
          "id": "1x74FxGPSKP3_MU8endjZa_J1Kd7GBIUm",
          "name": "pension202502.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1x74FxGPSKP3_MU8endjZa_J1Kd7GBIUm/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-04-08T10:40:28.160+09:00",
          "updated": "2025-04-08T10:39:32.000+09:00"
        },
        {
          "id": "1bb2PxD3bAIfcMbnTSFoCCr_kGrfn_R5Y",
          "name": "HS202503.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1bb2PxD3bAIfcMbnTSFoCCr_kGrfn_R5Y/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-04-08T10:40:30.411+09:00",
          "updated": "2025-04-08T10:38:18.000+09:00"
        },
        {
          "id": "1rj2By92TP6pjqFzeYVSy7B2kBW7lCTjc",
          "name": "HS202502.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1rj2By92TP6pjqFzeYVSy7B2kBW7lCTjc/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-04-08T10:40:32.884+09:00",
          "updated": "2025-04-08T10:37:49.000+09:00"
        },
        {
          "id": "1naSwYUsHJ3br91OqrrNiWUA7KwTB8zVS",
          "name": "202504.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1naSwYUsHJ3br91OqrrNiWUA7KwTB8zVS/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-04-07T13:10:36.404+09:00",
          "updated": "2025-04-07T13:07:08.000+09:00"
        },
        {
          "id": "1aV2AaO8cS7x0O732W7-fbCeotsVWb5vg",
          "name": "202503.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1aV2AaO8cS7x0O732W7-fbCeotsVWb5vg/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-04-07T13:10:35.540+09:00",
          "updated": "2025-04-07T13:06:21.000+09:00"
        },
        {
          "id": "14-zEmyDeTq55ya3MTc9fCcpnLcA3497l",
          "name": "202502.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/14-zEmyDeTq55ya3MTc9fCcpnLcA3497l/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-04-07T13:10:36.404+09:00",
          "updated": "2025-04-07T13:05:41.000+09:00"
        },
        {
          "id": "1dpS_E7PbJYv-FfVGHIMxlfnZzLw5lbLF",
          "name": "20250228_400_000.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1dpS_E7PbJYv-FfVGHIMxlfnZzLw5lbLF/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-03-14T15:58:52.000+09:00",
          "updated": "2025-04-07T12:52:51.173+09:00"
        },
        {
          "id": "1lkDFoTaOMbcjcFgv3gXOf8gYu4PnTqm0",
          "name": "20250228_400_003.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1lkDFoTaOMbcjcFgv3gXOf8gYu4PnTqm0/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-03-14T15:58:52.000+09:00",
          "updated": "2025-04-07T12:52:41.532+09:00"
        },
        {
          "id": "1Q0FrqOjnfjcl1bioBtydtdZZmoajRQXC",
          "name": "20250131_400_000.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1Q0FrqOjnfjcl1bioBtydtdZZmoajRQXC/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-02-14T13:26:30.000+09:00",
          "updated": "2025-04-07T12:52:07.928+09:00"
        },
        {
          "id": "1ewPi8zV-IKpmLpSYNQiyGkzN_yBoALBQ",
          "name": "20250131_400_003.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1ewPi8zV-IKpmLpSYNQiyGkzN_yBoALBQ/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-02-14T13:26:31.000+09:00",
          "updated": "2025-04-07T12:51:56.800+09:00"
        },
        {
          "id": "1EF-b61LzHlJo-33zNWLupLLxRGl7dHGB",
          "name": "CK202503.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1EF-b61LzHlJo-33zNWLupLLxRGl7dHGB/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-03-12T09:05:31.530+09:00",
          "updated": "2025-03-11T13:19:42.000+09:00"
        },
        {
          "id": "16Dmq8oqUV4zzBN6GjFryKjdfH-9Q-9tg",
          "name": "EF202503.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/16Dmq8oqUV4zzBN6GjFryKjdfH-9Q-9tg/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-03-12T09:05:33.748+09:00",
          "updated": "2025-03-11T10:24:44.000+09:00"
        },
        {
          "id": "1fNZ4pv2Xao-VYGXnCdpsseUrhfFnVZpq",
          "name": "CK202502.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1fNZ4pv2Xao-VYGXnCdpsseUrhfFnVZpq/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-02-10T15:50:40.969+09:00",
          "updated": "2025-02-08T14:09:06.000+09:00"
        },
        {
          "id": "1_dQYOWclrqs44JNF5KAJ40jsNnfpuBf4",
          "name": "EF202502.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1_dQYOWclrqs44JNF5KAJ40jsNnfpuBf4/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-02-10T15:50:43.055+09:00",
          "updated": "2025-02-08T14:05:34.000+09:00"
        },
        {
          "id": "1mHSAOycMALDi4RGbVtlbW1H-9zmNoyCZ",
          "name": "note202407.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1mHSAOycMALDi4RGbVtlbW1H-9zmNoyCZ/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T17:02:59.510+09:00",
          "updated": "2025-01-27T16:54:46.000+09:00"
        },
        {
          "id": "16bpSXt1abglQdviYBQwlgrJbqAtAphWo",
          "name": "note202406.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/16bpSXt1abglQdviYBQwlgrJbqAtAphWo/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T17:03:00.786+09:00",
          "updated": "2025-01-27T16:54:41.000+09:00"
        },
        {
          "id": "1O_LONeEvOnHlBrmCeQ8EOShUyRmLQWQ9",
          "name": "note202405.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1O_LONeEvOnHlBrmCeQ8EOShUyRmLQWQ9/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T17:03:00.786+09:00",
          "updated": "2025-01-27T16:54:37.000+09:00"
        },
        {
          "id": "1sZl7XWWOxQINuhJe5oTQCf43ZA2UfjEH",
          "name": "note202404.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1sZl7XWWOxQINuhJe5oTQCf43ZA2UfjEH/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T17:03:00.786+09:00",
          "updated": "2025-01-27T16:54:32.000+09:00"
        },
        {
          "id": "1odsw2M5DODSQ_B5jyK-1l4Mh57IhXPiY",
          "name": "note202403.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1odsw2M5DODSQ_B5jyK-1l4Mh57IhXPiY/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T17:03:02.457+09:00",
          "updated": "2025-01-27T16:54:27.000+09:00"
        },
        {
          "id": "128bk842qaJY3qi27to8oDRvPATwUOcvy",
          "name": "note202402.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/128bk842qaJY3qi27to8oDRvPATwUOcvy/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T17:03:00.786+09:00",
          "updated": "2025-01-27T16:54:23.000+09:00"
        },
        {
          "id": "19BQJ1r14XeiP1IaPSoGk0_aLq8wXttXG",
          "name": "note202401.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/19BQJ1r14XeiP1IaPSoGk0_aLq8wXttXG/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T17:03:00.786+09:00",
          "updated": "2025-01-27T16:54:17.000+09:00"
        },
        {
          "id": "1M83T8RtTzJ0pyYsGGbd8wy0R6EdjUYXr",
          "name": "note202408.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1M83T8RtTzJ0pyYsGGbd8wy0R6EdjUYXr/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T16:53:48.620+09:00",
          "updated": "2025-01-27T16:51:42.000+09:00"
        },
        {
          "id": "1_2yg32TpU70QBdCbT8v8Sr0PX3PNUDtO",
          "name": "note202409.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1_2yg32TpU70QBdCbT8v8Sr0PX3PNUDtO/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T16:53:47.606+09:00",
          "updated": "2025-01-27T16:51:36.000+09:00"
        },
        {
          "id": "1vFdsfFrDghjn1YVo3gFHNyUGSwEVoou4",
          "name": "pension202501.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1vFdsfFrDghjn1YVo3gFHNyUGSwEVoou4/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T16:46:13.596+09:00",
          "updated": "2025-01-27T16:40:54.000+09:00"
        },
        {
          "id": "1s2et1wZc2kqW1c6CtCL79ZUUYEMEPmaj",
          "name": "pension202412.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1s2et1wZc2kqW1c6CtCL79ZUUYEMEPmaj/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T16:46:14.539+09:00",
          "updated": "2025-01-27T16:40:50.000+09:00"
        },
        {
          "id": "1COWbHg_AG286AfAttNgrg3ZMjrWRwx1u",
          "name": "pension202411.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1COWbHg_AG286AfAttNgrg3ZMjrWRwx1u/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T16:46:14.539+09:00",
          "updated": "2025-01-27T16:40:46.000+09:00"
        },
        {
          "id": "1-_XLb5MqiGnlBSj0hhV7q_oz0T2oVPW_",
          "name": "pension202410.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1-_XLb5MqiGnlBSj0hhV7q_oz0T2oVPW_/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T16:46:14.539+09:00",
          "updated": "2025-01-27T16:40:42.000+09:00"
        },
        {
          "id": "1XFImLh3oQJ5xAWTwUv0QtDn03SGUpqNS",
          "name": "HS202501.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1XFImLh3oQJ5xAWTwUv0QtDn03SGUpqNS/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T16:46:14.539+09:00",
          "updated": "2025-01-27T16:40:32.000+09:00"
        },
        {
          "id": "18PRA45x0i4h7EBoKpwFMQpSJUJU_poc_",
          "name": "HS202412.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/18PRA45x0i4h7EBoKpwFMQpSJUJU_poc_/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T16:46:14.539+09:00",
          "updated": "2025-01-27T16:40:28.000+09:00"
        },
        {
          "id": "1Z0B0sjEAm3taT9XxWtWGErQKp8_EkP67",
          "name": "HS202411.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1Z0B0sjEAm3taT9XxWtWGErQKp8_EkP67/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T16:46:13.596+09:00",
          "updated": "2025-01-27T16:40:24.000+09:00"
        },
        {
          "id": "1DMXrens7X7ddj-uODheqXLuZ2IdKuOzg",
          "name": "HS202410.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1DMXrens7X7ddj-uODheqXLuZ2IdKuOzg/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T16:46:12.869+09:00",
          "updated": "2025-01-27T16:40:20.000+09:00"
        },
        {
          "id": "1YwnwWEOHIrcVxrKACi_iZaD64ifnT9ei",
          "name": "Amazon.co.jp - 注文番号 249-4845575-3719036.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1YwnwWEOHIrcVxrKACi_iZaD64ifnT9ei/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T13:14:32.229+09:00",
          "updated": "2025-01-27T13:14:18.000+09:00"
        },
        {
          "id": "195AbJCoKG74szRbjbo-19CrL2YTjgk3E",
          "name": "Amazon.co.jp - 注文番号 249-6593585-8211811.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/195AbJCoKG74szRbjbo-19CrL2YTjgk3E/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T13:10:21.978+09:00",
          "updated": "2025-01-27T13:09:26.000+09:00"
        },
        {
          "id": "1Ca2sWeFGd7ZkWfnCw4K6NnYxYU8BYJKF",
          "name": "Amazon.co.jp - 注文番号 249-2194427-8251059.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1Ca2sWeFGd7ZkWfnCw4K6NnYxYU8BYJKF/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T13:10:28.012+09:00",
          "updated": "2025-01-27T13:09:01.000+09:00"
        },
        {
          "id": "1Q7x6RsI6UcQMuKRkgtA6O6xzmk359CSo",
          "name": "Amazon.co.jp - 注文番号 249-8191798-9007841.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1Q7x6RsI6UcQMuKRkgtA6O6xzmk359CSo/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T13:10:25.007+09:00",
          "updated": "2025-01-27T13:08:34.000+09:00"
        },
        {
          "id": "1yQfuzlIZWhcP0RNOZU_qT6EeyOLEBd-N",
          "name": "Amazon.co.jp - 注文番号 249-4204728-6112628.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1yQfuzlIZWhcP0RNOZU_qT6EeyOLEBd-N/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T13:10:13.902+09:00",
          "updated": "2025-01-27T13:08:00.000+09:00"
        },
        {
          "id": "1WFRbAeaRy-9fkGkbaN4wzskEjHjC6DTr",
          "name": "Amazon.co.jp - 注文番号 249-3858977-2955844.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1WFRbAeaRy-9fkGkbaN4wzskEjHjC6DTr/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T13:10:19.176+09:00",
          "updated": "2025-01-27T13:07:28.000+09:00"
        },
        {
          "id": "1wUYvRxTDWigLenGmOvb3FzOD1DAklilJ",
          "name": "Amazon.co.jp - 注文番号 249-2647820-1244618.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1wUYvRxTDWigLenGmOvb3FzOD1DAklilJ/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T13:10:16.472+09:00",
          "updated": "2025-01-27T13:06:55.000+09:00"
        },
        {
          "id": "1DFKN2otaoWswY7-NcnbxLyYoyUYCuMCx",
          "name": "202501.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1DFKN2otaoWswY7-NcnbxLyYoyUYCuMCx/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T12:25:32.397+09:00",
          "updated": "2025-01-27T12:25:02.000+09:00"
        },
        {
          "id": "1yttzxFoy0zIw9AYRnIO248VSqMt8f9pB",
          "name": "202412.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1yttzxFoy0zIw9AYRnIO248VSqMt8f9pB/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T12:25:31.241+09:00",
          "updated": "2025-01-27T12:24:31.000+09:00"
        },
        {
          "id": "1te4t3VlgpmamtirE6TXdRRPOF8QRaFCW",
          "name": "202411.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1te4t3VlgpmamtirE6TXdRRPOF8QRaFCW/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T12:25:31.241+09:00",
          "updated": "2025-01-27T12:24:09.000+09:00"
        },
        {
          "id": "1YeL8afVQWWQ4kLbZy4SGpCiQFbRGdwN0",
          "name": "202410.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1YeL8afVQWWQ4kLbZy4SGpCiQFbRGdwN0/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-27T12:25:30.381+09:00",
          "updated": "2025-01-27T12:23:41.000+09:00"
        },
        {
          "id": "1L918Z3YTo2lfYaBoTVjSYIodV3ha8J3t",
          "name": "20241231_400_003.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1L918Z3YTo2lfYaBoTVjSYIodV3ha8J3t/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-15T12:08:47.000+09:00",
          "updated": "2025-01-27T11:51:55.568+09:00"
        },
        {
          "id": "1w7-YBX6Eg3cV489U8N4Rr_9XTKQYaKX8",
          "name": "20241231_400_000.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1w7-YBX6Eg3cV489U8N4Rr_9XTKQYaKX8/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-15T12:08:46.000+09:00",
          "updated": "2025-01-27T11:51:47.043+09:00"
        },
        {
          "id": "1GLN4kWtVPiD2AQgjUn_s3rlYN30V49bS",
          "name": "20241130_400_003.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1GLN4kWtVPiD2AQgjUn_s3rlYN30V49bS/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2024-12-16T13:07:43.000+09:00",
          "updated": "2025-01-27T11:51:25.459+09:00"
        },
        {
          "id": "13YqXmS_WQXxUC0Hb1phNtbBqvQ-Pw16p",
          "name": "20241130_400_000.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/13YqXmS_WQXxUC0Hb1phNtbBqvQ-Pw16p/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2024-12-16T13:07:43.000+09:00",
          "updated": "2025-01-27T11:51:14.175+09:00"
        },
        {
          "id": "1Z8-FRUHfHIzuFZPzvRAjXZOmg3gmfrnZ",
          "name": "20241031_400_000.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1Z8-FRUHfHIzuFZPzvRAjXZOmg3gmfrnZ/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2024-11-15T12:33:14.000+09:00",
          "updated": "2025-01-27T11:50:42.861+09:00"
        },
        {
          "id": "1aRcrF5P2Jf2doBWW5th5BuJu0YCzhwon",
          "name": "20241031_400_003.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1aRcrF5P2Jf2doBWW5th5BuJu0YCzhwon/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2024-11-15T12:33:15.000+09:00",
          "updated": "2025-01-27T11:50:33.915+09:00"
        },
        {
          "id": "16OnYUqZY3GNAZpPkvXiymN7leB2JDVo-",
          "name": "20240930_400_003.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/16OnYUqZY3GNAZpPkvXiymN7leB2JDVo-/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2024-10-15T11:55:48.000+09:00",
          "updated": "2025-01-27T11:50:10.675+09:00"
        },
        {
          "id": "1hb-AJG_fU9uXoZTIEV93-FvYwWaL2ROZ",
          "name": "20240930_400_000.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1hb-AJG_fU9uXoZTIEV93-FvYwWaL2ROZ/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2024-10-15T11:55:47.000+09:00",
          "updated": "2025-01-27T11:50:00.776+09:00"
        },
        {
          "id": "1pavHX7kCuq5vo2w1SKjkHHo99ujBCQKV",
          "name": "EF202501.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1pavHX7kCuq5vo2w1SKjkHHo99ujBCQKV/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-13T16:47:01.638+09:00",
          "updated": "2025-01-11T10:36:00.000+09:00"
        },
        {
          "id": "1uI1F3dE_cy2KZ-O_URWZscRFaQXqyKNQ",
          "name": "CK202501.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1uI1F3dE_cy2KZ-O_URWZscRFaQXqyKNQ/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-13T16:46:59.011+09:00",
          "updated": "2025-01-11T09:57:16.000+09:00"
        },
        {
          "id": "19jlv3d8sbcE7EDJnasyM5HQIgZjg1mu0",
          "name": "20250109_SMBCローン返済明細書.pdf",
          "mime": "application/pdf",
          "desc": "Uploaded from App",
          "url": "https://drive.google.com/file/d/19jlv3d8sbcE7EDJnasyM5HQIgZjg1mu0/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2025-01-09T15:52:41.127+09:00",
          "updated": "2025-01-09T15:55:06.246+09:00"
        },
        {
          "id": "18exrmCa45gXffolZO9vdU5GD0B2EAK1N",
          "name": "20241211_司法書士請求書.pdf",
          "mime": "application/pdf",
          "desc": "Uploaded from App",
          "url": "https://drive.google.com/file/d/18exrmCa45gXffolZO9vdU5GD0B2EAK1N/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2024-12-25T15:45:50.393+09:00",
          "updated": "2024-12-25T15:45:50.393+09:00"
        },
        {
          "id": "1ZSCRhUWPCdeZJldHgbFQgZTQKVAP2Bsc",
          "name": "CK202412.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1ZSCRhUWPCdeZJldHgbFQgZTQKVAP2Bsc/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2024-12-16T09:19:31.776+09:00",
          "updated": "2024-12-09T15:59:06.000+09:00"
        },
        {
          "id": "1VnSjX38DoLGxfCzIg-tl8tDRRT3IVh4g",
          "name": "EF202412.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1VnSjX38DoLGxfCzIg-tl8tDRRT3IVh4g/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2024-12-16T09:19:33.924+09:00",
          "updated": "2024-12-09T15:51:30.000+09:00"
        },
        {
          "id": "1aJlK0Gk2IFQ1B_-Uph6ahGpU9RXDaG4L",
          "name": "CK202411.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1aJlK0Gk2IFQ1B_-Uph6ahGpU9RXDaG4L/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2024-11-10T09:06:11.478+09:00",
          "updated": "2024-11-09T14:52:00.000+09:00"
        },
        {
          "id": "1gHimOtXHVvzUCJwv4YA4R8DTKwPQTTH-",
          "name": "EF202411.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1gHimOtXHVvzUCJwv4YA4R8DTKwPQTTH-/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2024-11-10T09:06:13.915+09:00",
          "updated": "2024-11-09T14:35:28.000+09:00"
        },
        {
          "id": "1u5n77hzw84eTeMAkqTsr5v-ccarY62cK",
          "name": "CK202410.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1u5n77hzw84eTeMAkqTsr5v-ccarY62cK/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2024-10-10T11:44:34.400+09:00",
          "updated": "2024-10-09T16:31:40.000+09:00"
        },
        {
          "id": "1_01-0Z7dfKT18_gPzxUlPnfTqTTbnQwY",
          "name": "EF202410.pdf",
          "mime": "application/pdf",
          "desc": "",
          "url": "https://drive.google.com/file/d/1_01-0Z7dfKT18_gPzxUlPnfTqTTbnQwY/view?usp=drivesdk",
          "viewers": "",
          "editors": "takeda-erika@tkcnf.or.jp",
          "created": "2024-10-10T11:44:36.466+09:00",
          "updated": "2024-10-09T15:58:24.000+09:00"
        }
      ]
    },
    {
      "name": "記入用",
      "primaryKey": "id",
      "cols": [
        {
          "name": "id",
          "type": "string",
          "note": "ファイルのID"
        },
        {
          "name": "name",
          "type": "string",
          "note": "ファイル(フォルダ)名"
        },
        {
          "name": "link",
          "type": "string",
          "note": "プレビュー用URL"
        },
        {
          "name": "isExist",
          "type": "boolean",
          "note": "GD上の状態(存否)"
        },
        {
          "name": "type",
          "type": "string",
          "note": "証憑としての分類。report.html上の掲載するdiv[data-type]"
        },
        {
          "name": "date",
          "type": "string",
          "note": "取引日。電子証憑・参考等、report.html上取引日の表示が必要な場合設定"
        },
        {
          "name": "label",
          "type": "string",
          "note": "摘要(電子証憑)、行き先(交通費)、資料名(参考)"
        },
        {
          "name": "price",
          "label": "価格",
          "type": "string"
        },
        {
          "name": "payby",
          "label": "支払方法",
          "type": "string",
          "note": "役員借入金 or AMEX"
        },
        {
          "name": "note",
          "label": "備考",
          "type": "string",
          "note": "特記事項の本文(MD)、他はpdf上の頁指定等"
        }
      ],
      "initial": "() => [\n        {\"id\":\"1uu_NH-iGsQYC21pVZS3vohIVfhYaJrn_\",\"type\":\"参考\",\"date\":\"2025/05/16\",\"label\":\"2025年度給与所得等に係る特別徴収税額の決定通知書\"},\n        {\"id\":\"11pXYjxhKQIklRiAFQJNKQZ8JtpLUgKZC\",\"type\":\"電子証憑\",\"date\":\"2024/10/28\",\"label\":\"スマホスタンド\",\"price\":1850,\"payby\":\"役員借入金\"},\n        {\"id\":\"1WFRbAeaRy-9fkGkbaN4wzskEjHjC6DTr\",\"type\":\"電子証憑\",\"date\":\"2024/11/16\",\"label\":\"ボールペン替芯\",\"price\":545,\"payby\":\"AMEX\"},\n        {\"id\":\"1wUYvRxTDWigLenGmOvb3FzOD1DAklilJ\",\"type\":\"電子証憑\",\"date\":\"2024/11/16\",\"label\":\"文具\",\"price\":3524,\"payby\":\"AMEX\"},\n        {\"id\":\"1iLsevNUcaq9kp3rqCarZMwhG1HdFcgOL\",\"type\":\"電子証憑\",\"date\":\"2024/12/05\",\"label\":\"スマホフィルム\",\"price\":2520,\"payby\":\"役員借入金\"},\n        {\"id\":\"1yQfuzlIZWhcP0RNOZU_qT6EeyOLEBd-N\",\"type\":\"電子証憑\",\"date\":\"2024/12/07\",\"label\":\"スマホ消耗品、書籍\",\"price\":3899,\"payby\":\"AMEX\"},\n        {\"id\":\"1YwnwWEOHIrcVxrKACi_iZaD64ifnT9ei\",\"type\":\"電子証憑\",\"date\":\"2024/12/09\",\"label\":\"書籍\",\"price\":3080,\"payby\":\"AMEX\"},\n        {\"id\":\"1Ca2sWeFGd7ZkWfnCw4K6NnYxYU8BYJKF\",\"type\":\"電子証憑\",\"date\":\"2024/12/09\",\"label\":\"プリンタインク\",\"price\":1180,\"payby\":\"AMEX\"},\n        {\"id\":\"1Q7x6RsI6UcQMuKRkgtA6O6xzmk359CSo\",\"type\":\"電子証憑\",\"date\":\"2024/12/09\",\"label\":\"USB充電器\",\"price\":3919,\"payby\":\"AMEX\"},\n        {\"id\":\"195AbJCoKG74szRbjbo-19CrL2YTjgk3E\",\"type\":\"電子証憑\",\"date\":\"2024/12/11\",\"label\":\"クリヤーブック\",\"price\":2220,\"payby\":\"AMEX\"},\n        {\"id\":\"18exrmCa45gXffolZO9vdU5GD0B2EAK1N\",\"type\":\"電子証憑\",\"date\":\"2024/12/11\",\"label\":\"司法書士(登記変更、他)\",\"price\":93500,\"payby\":\"役員借入金\",\"note\":\"p.2のみ\"},\n        {\"id\":\"1dEIdlcHtfkXresrJVvi7yqschZRA9N_W\",\"type\":\"電子証憑\",\"date\":\"2025/01/28\",\"label\":\"PC周辺機器\",\"price\":1310,\"payby\":\"役員借入金\"},\n        {\"id\":\"1Bc1ZAMHhib6spfk-bGnUhRamFZOzAXDx\",\"type\":\"電子証憑\",\"date\":\"2025/03/13\",\"label\":\"養生テープ\",\"price\":1369,\"payby\":\"AMEX\"},\n        {\"id\":\"1A99DTWWEdXUq8KAFu-nq-hVuWer3T9WG\",\"type\":\"電子証憑\",\"date\":\"2025/05/07\",\"label\":\"営繕・補修用資材\",\"price\":4747,\"payby\":\"役員借入金\"},\n        {\"id\":\"1YamIvPbChf_wYt8lvs7wvWmQEQKdhL6D\",\"type\":\"電子証憑\",\"date\":\"2025/05/07\",\"label\":\"営繕・補修用資材\",\"price\":123,\"payby\":\"役員借入金\"},\n        {\"id\":\"1kdiuk2zTVwL9BAKBocuyCj5HltUvKDF-\",\"type\":\"電子証憑\",\"date\":\"2025/05/08\",\"label\":\"営繕・補修用資材\",\"price\":2813,\"payby\":\"役員借入金\"},\n        {\"id\":\"1DaGH1LmErJ0Pc7gcz4uP8PHgP9xyorJC\",\"type\":\"電子証憑\",\"date\":\"2025/05/22\",\"label\":\"備品(バスケット)\",\"price\":5279,\"payby\":\"役員借入金\"},\n        {\"id\":\"1g3O_7tt7SBgD_-Ul2Yv9qEgndOWltMty\",\"type\":\"電子証憑\",\"date\":\"2025/07/03\",\"label\":\"カメラ(本体)\",\"price\":136170,\"payby\":\"役員借入金\"},\n        {\"id\":\"1Bun4eFNXtr7R_e9vz8yzoXfwLPDyNyyI\",\"type\":\"電子証憑\",\"date\":\"2025/08/06\",\"label\":\"若宮宅残置物撤去\",\"price\":330000,\"payby\":\"役員借入金\"},\n        {\"id\":\"19jlv3d8sbcE7EDJnasyM5HQIgZjg1mu0\",\"type\":\"返済明細\",\"date\":\"2024/12/30\",\"label\":\"SMBCローン返済明細\"},\n        {\"id\":\"1xXxbijwGf65A75_BV54jjEQWBzYf8uss\",\"type\":\"返済明細\",\"date\":\"2025/04/21\",\"label\":\"SMBCローン返済明細\"},\n        {\"id\":\"1sk5K2tTHlsoTCuxRCIEEstGJRWSqYbvD\",\"type\":\"返済明細\",\"date\":\"2024/10/01\",\"label\":\"SMTLFローン返済明細\"},\n      ]",
      "data": [
        {
          "id": "1ydJXUwV6bwA6SgMoy1rkalemzPhtj-G9",
          "name": "20250605_固都税納税通知書.pdf",
          "link": "https://drive.google.com/file/d/1ydJXUwV6bwA6SgMoy1rkalemzPhtj-G9/preview",
          "isExist": "TRUE",
          "type": "",
          "date": "",
          "label": "",
          "price": "",
          "payby": "",
          "note": ""
        },
        {
          "id": "1uu_NH-iGsQYC21pVZS3vohIVfhYaJrn_",
          "name": "2025年度給与所得等に係る税額決定通知書.pdf",
          "link": "https://drive.google.com/file/d/1uu_NH-iGsQYC21pVZS3vohIVfhYaJrn_/preview",
          "isExist": "TRUE",
          "type": "参考",
          "date": "2025/05/16",
          "label": "2025年度給与所得等に係る特別徴収税額の決定通知書",
          "price": "",
          "payby": "",
          "note": ""
        },
        {
          "id": "1sk5K2tTHlsoTCuxRCIEEstGJRWSqYbvD",
          "name": "SMTLF202501.pdf",
          "link": "https://drive.google.com/file/d/1sk5K2tTHlsoTCuxRCIEEstGJRWSqYbvD/preview",
          "isExist": "TRUE",
          "type": "返済明細",
          "date": "2024/10/01",
          "label": "SMTLFローン返済明細",
          "price": "",
          "payby": "",
          "note": ""
        },
        {
          "id": "19jlv3d8sbcE7EDJnasyM5HQIgZjg1mu0",
          "name": "20250109_SMBCローン返済明細書.pdf",
          "link": "https://drive.google.com/file/d/19jlv3d8sbcE7EDJnasyM5HQIgZjg1mu0/preview",
          "isExist": "TRUE",
          "type": "返済明細",
          "date": "2024/12/30",
          "label": "SMBCローン返済明細",
          "price": "",
          "payby": "",
          "note": ""
        },
        {
          "id": "1xXxbijwGf65A75_BV54jjEQWBzYf8uss",
          "name": "20250421_SMBCローン返済明細書.pdf",
          "link": "https://drive.google.com/file/d/1xXxbijwGf65A75_BV54jjEQWBzYf8uss/preview",
          "isExist": "TRUE",
          "type": "返済明細",
          "date": "2025/04/21",
          "label": "SMBCローン返済明細",
          "price": "",
          "payby": "",
          "note": ""
        },
        {
          "id": "11pXYjxhKQIklRiAFQJNKQZ8JtpLUgKZC",
          "name": "20241025_スマホスタンド領収書.pdf",
          "link": "https://drive.google.com/file/d/11pXYjxhKQIklRiAFQJNKQZ8JtpLUgKZC/preview",
          "isExist": "TRUE",
          "type": "電子証憑",
          "date": "2024/10/28",
          "label": "スマホスタンド",
          "price": "1850",
          "payby": "役員借入金",
          "note": ""
        },
        {
          "id": "1WFRbAeaRy-9fkGkbaN4wzskEjHjC6DTr",
          "name": "Amazon.co.jp - 注文番号 249-3858977-2955844.pdf",
          "link": "https://drive.google.com/file/d/1WFRbAeaRy-9fkGkbaN4wzskEjHjC6DTr/preview",
          "isExist": "TRUE",
          "type": "電子証憑",
          "date": "2024/11/16",
          "label": "ボールペン替芯",
          "price": "545",
          "payby": "AMEX",
          "note": ""
        },
        {
          "id": "1wUYvRxTDWigLenGmOvb3FzOD1DAklilJ",
          "name": "Amazon.co.jp - 注文番号 249-2647820-1244618.pdf",
          "link": "https://drive.google.com/file/d/1wUYvRxTDWigLenGmOvb3FzOD1DAklilJ/preview",
          "isExist": "TRUE",
          "type": "電子証憑",
          "date": "2024/11/16",
          "label": "文具",
          "price": "3524",
          "payby": "AMEX",
          "note": ""
        },
        {
          "id": "1iLsevNUcaq9kp3rqCarZMwhG1HdFcgOL",
          "name": "20241206_スマホフィルム領収書.pdf",
          "link": "https://drive.google.com/file/d/1iLsevNUcaq9kp3rqCarZMwhG1HdFcgOL/preview",
          "isExist": "TRUE",
          "type": "電子証憑",
          "date": "2024/12/05",
          "label": "スマホフィルム",
          "price": "2520",
          "payby": "役員借入金",
          "note": ""
        },
        {
          "id": "1yQfuzlIZWhcP0RNOZU_qT6EeyOLEBd-N",
          "name": "Amazon.co.jp - 注文番号 249-4204728-6112628.pdf",
          "link": "https://drive.google.com/file/d/1yQfuzlIZWhcP0RNOZU_qT6EeyOLEBd-N/preview",
          "isExist": "TRUE",
          "type": "電子証憑",
          "date": "2024/12/07",
          "label": "スマホ消耗品、書籍",
          "price": "3899",
          "payby": "AMEX",
          "note": ""
        },
        {
          "id": "1YwnwWEOHIrcVxrKACi_iZaD64ifnT9ei",
          "name": "Amazon.co.jp - 注文番号 249-4845575-3719036.pdf",
          "link": "https://drive.google.com/file/d/1YwnwWEOHIrcVxrKACi_iZaD64ifnT9ei/preview",
          "isExist": "TRUE",
          "type": "電子証憑",
          "date": "2024/12/09",
          "label": "書籍",
          "price": "3080",
          "payby": "AMEX",
          "note": ""
        },
        {
          "id": "1Ca2sWeFGd7ZkWfnCw4K6NnYxYU8BYJKF",
          "name": "Amazon.co.jp - 注文番号 249-2194427-8251059.pdf",
          "link": "https://drive.google.com/file/d/1Ca2sWeFGd7ZkWfnCw4K6NnYxYU8BYJKF/preview",
          "isExist": "TRUE",
          "type": "電子証憑",
          "date": "2024/12/09",
          "label": "プリンタインク",
          "price": "1180",
          "payby": "AMEX",
          "note": ""
        },
        {
          "id": "1Q7x6RsI6UcQMuKRkgtA6O6xzmk359CSo",
          "name": "Amazon.co.jp - 注文番号 249-8191798-9007841.pdf",
          "link": "https://drive.google.com/file/d/1Q7x6RsI6UcQMuKRkgtA6O6xzmk359CSo/preview",
          "isExist": "TRUE",
          "type": "電子証憑",
          "date": "2024/12/09",
          "label": "USB充電器",
          "price": "3919",
          "payby": "AMEX",
          "note": ""
        },
        {
          "id": "195AbJCoKG74szRbjbo-19CrL2YTjgk3E",
          "name": "Amazon.co.jp - 注文番号 249-6593585-8211811.pdf",
          "link": "https://drive.google.com/file/d/195AbJCoKG74szRbjbo-19CrL2YTjgk3E/preview",
          "isExist": "TRUE",
          "type": "電子証憑",
          "date": "2024/12/11",
          "label": "クリヤーブック",
          "price": "2220",
          "payby": "AMEX",
          "note": ""
        },
        {
          "id": "18exrmCa45gXffolZO9vdU5GD0B2EAK1N",
          "name": "20241211_司法書士請求書.pdf",
          "link": "https://drive.google.com/file/d/18exrmCa45gXffolZO9vdU5GD0B2EAK1N/preview",
          "isExist": "TRUE",
          "type": "電子証憑",
          "date": "2024/12/11",
          "label": "司法書士(登記変更、他)",
          "price": "93500",
          "payby": "役員借入金",
          "note": "p.2のみ"
        },
        {
          "id": "1dEIdlcHtfkXresrJVvi7yqschZRA9N_W",
          "name": "20250125_ワイヤレスマウス領収書.pdf",
          "link": "https://drive.google.com/file/d/1dEIdlcHtfkXresrJVvi7yqschZRA9N_W/preview",
          "isExist": "TRUE",
          "type": "電子証憑",
          "date": "2025/01/28",
          "label": "PC周辺機器",
          "price": "1310",
          "payby": "役員借入金",
          "note": ""
        },
        {
          "id": "1Bc1ZAMHhib6spfk-bGnUhRamFZOzAXDx",
          "name": "Amazon.co.jp - 注文番号 249-7275815-9909431.pdf",
          "link": "https://drive.google.com/file/d/1Bc1ZAMHhib6spfk-bGnUhRamFZOzAXDx/preview",
          "isExist": "TRUE",
          "type": "電子証憑",
          "date": "2025/03/13",
          "label": "養生テープ",
          "price": "1369",
          "payby": "AMEX",
          "note": ""
        },
        {
          "id": "1A99DTWWEdXUq8KAFu-nq-hVuWer3T9WG",
          "name": "RC182643190.pdf",
          "link": "https://drive.google.com/file/d/1A99DTWWEdXUq8KAFu-nq-hVuWer3T9WG/preview",
          "isExist": "TRUE",
          "type": "電子証憑",
          "date": "2025/05/07",
          "label": "営繕・補修用資材",
          "price": "4747",
          "payby": "役員借入金",
          "note": ""
        },
        {
          "id": "1YamIvPbChf_wYt8lvs7wvWmQEQKdhL6D",
          "name": "RC182643445.pdf",
          "link": "https://drive.google.com/file/d/1YamIvPbChf_wYt8lvs7wvWmQEQKdhL6D/preview",
          "isExist": "TRUE",
          "type": "電子証憑",
          "date": "2025/05/07",
          "label": "営繕・補修用資材",
          "price": "123",
          "payby": "役員借入金",
          "note": ""
        },
        {
          "id": "1kdiuk2zTVwL9BAKBocuyCj5HltUvKDF-",
          "name": "RC182722417.pdf",
          "link": "https://drive.google.com/file/d/1kdiuk2zTVwL9BAKBocuyCj5HltUvKDF-/preview",
          "isExist": "TRUE",
          "type": "電子証憑",
          "date": "2025/05/08",
          "label": "営繕・補修用資材",
          "price": "2813",
          "payby": "役員借入金",
          "note": ""
        },
        {
          "id": "1DaGH1LmErJ0Pc7gcz4uP8PHgP9xyorJC",
          "name": "20250531_領収書 _ 無印良品.pdf",
          "link": "https://drive.google.com/file/d/1DaGH1LmErJ0Pc7gcz4uP8PHgP9xyorJC/preview",
          "isExist": "TRUE",
          "type": "電子証憑",
          "date": "2025/05/22",
          "label": "備品(バスケット)",
          "price": "5279",
          "payby": "役員借入金",
          "note": ""
        },
        {
          "id": "1g3O_7tt7SBgD_-Ul2Yv9qEgndOWltMty",
          "name": "カメラのキタムラ - 注文番号：6-25070337767.pdf",
          "link": "https://drive.google.com/file/d/1g3O_7tt7SBgD_-Ul2Yv9qEgndOWltMty/preview",
          "isExist": "TRUE",
          "type": "電子証憑",
          "date": "2025/07/03",
          "label": "カメラ(本体)",
          "price": "136170",
          "payby": "役員借入金",
          "note": ""
        },
        {
          "id": "1Bun4eFNXtr7R_e9vz8yzoXfwLPDyNyyI",
          "name": "レシート（発行_ アース西東京）.pdf",
          "link": "https://drive.google.com/file/d/1Bun4eFNXtr7R_e9vz8yzoXfwLPDyNyyI/preview",
          "isExist": "TRUE",
          "type": "電子証憑",
          "date": "2025/08/06",
          "label": "若宮宅残置物撤去",
          "price": "330000",
          "payby": "役員借入金",
          "note": ""
        },
        {
          "id": "",
          "name": "",
          "link": "",
          "isExist": false,
          "type": "特記事項",
          "date": "2024/12/01",
          "label": "通信キャリア変更",
          "price": "",
          "payby": "",
          "note": "2024/12にプロバイダ・キャリアをKDDI/UQ Mobile/Biglobeに変更"
        },
        {
          "id": "",
          "name": "",
          "link": "",
          "isExist": false,
          "type": "特記事項",
          "date": "2025/04/01",
          "label": "アルバイト採用",
          "price": "",
          "payby": "",
          "note": "2025/04/01よりアルバイトとして嶋津史奈を雇用。条件は以下の通り。\n- 作業内容：書類整理、会計業務補助\n- 時給1,200円、月25時間"
        }
      ]
    },
    {
      "name": "交通費",
      "cols": [
        {
          "name": "date",
          "label": "日付",
          "type": "string"
        },
        {
          "name": "destination",
          "label": "行先",
          "type": "string"
        },
        {
          "name": "label",
          "label": "目的",
          "type": "string"
        },
        {
          "name": "route",
          "label": "経路",
          "type": "string"
        },
        {
          "name": "number",
          "label": "人数",
          "type": "number"
        },
        {
          "name": "price",
          "label": "金額",
          "type": "number",
          "printf": "o=>Number(o.price).toLocaleString()"
        },
        {
          "name": "note",
          "label": "備考",
          "type": "string"
        }
      ],
      "initial": "() => [\n        {\"date\":\"2024/10/08\",\"destination\":\"羽沢\",\"label\":\"現状確認\",\"route\":\"笹塚 - 市ヶ谷 - 新桜台\",\"number\":1,\"price\":1240},\n        {\"date\":\"2024/11/08\",\"destination\":\"上池袋\",\"label\":\"現状確認\",\"route\":\"笹塚 - 新宿 - 板橋\",\"number\":1,\"price\":640},\n        {\"date\":\"2024/12/09\",\"destination\":\"恵比寿\",\"label\":\"現状確認\",\"route\":\"笹塚 - 新宿 - 恵比寿\",\"number\":1,\"price\":620},\n        {\"date\":\"2024/12/10\",\"destination\":\"オーシャン\",\"label\":\"打合せ(登記変更依頼)\",\"route\":\"代々木上原 - 表参道\",\"number\":1,\"price\":360},\n        {\"date\":\"2025/01/08\",\"destination\":\"羽沢\",\"label\":\"現状確認\",\"route\":\"笹塚 - 市ヶ谷 - 新桜台\",\"number\":1,\"price\":1240},\n        {\"date\":\"2024/11/10\",\"destination\":\"ふじやまビレジ\",\"label\":\"打合せ(方針論議)\",\"route\":\"笹塚 - 上界戸\",\"number\":2,\"price\":14800,\"note\":\"〜11/12\"},\n        {\"date\":\"2025/02/08\",\"destination\":\"上池袋\",\"label\":\"現状確認\",\"route\":\"笹塚 - 新宿 - 板橋\",\"number\":1,\"price\":640},\n        {\"date\":\"2025/03/01\",\"destination\":\"上池袋\",\"label\":\"SB現調\",\"route\":\"笹塚 - 新宿 - 板橋\",\"number\":2,\"price\":1280},\n        {\"date\":\"2025/03/09\",\"destination\":\"恵比寿\",\"label\":\"現状確認\",\"route\":\"笹塚 - 新宿 - 恵比寿\",\"number\":1,\"price\":620},\n        {\"date\":\"2025/03/26\",\"destination\":\"上池袋\",\"label\":\"SB現調\",\"route\":\"笹塚 - 新宿 - 板橋\",\"number\":1,\"price\":640},\n        {\"date\":\"2025/04/08\",\"destination\":\"羽沢\",\"label\":\"現状確認\",\"route\":\"笹塚 - 市ヶ谷 - 新桜台\",\"number\":1,\"price\":1240},\n        {\"date\":\"2025/05/08\",\"destination\":\"上池袋\",\"label\":\"現状確認\",\"route\":\"笹塚 - 新宿 - 板橋\",\"number\":1,\"price\":640},\n        {\"date\":\"2025/05/24\",\"destination\":\"野方\",\"label\":\"現地調査\",\"route\":\"笹塚 - 新宿 - 高田馬場 - 野方\",\"number\":2,\"price\":1880},\n        {\"date\":\"2025/06/08\",\"destination\":\"恵比寿\",\"label\":\"現状確認\",\"route\":\"笹塚 - 新宿 - 恵比寿\",\"number\":1,\"price\":620},\n        {\"date\":\"2025/07/04\",\"destination\":\"野方\",\"label\":\"現状確認、清掃\",\"route\":\"笹塚 - 新宿 - 高田馬場 - 野方\",\"number\":1,\"price\":940},\n        {\"date\":\"2025/07/08\",\"destination\":\"羽沢\",\"label\":\"現状確認\",\"route\":\"笹塚 - 市ヶ谷 - 新桜台\",\"number\":1,\"price\":1240},\n        {\"date\":\"2025/07/23\",\"destination\":\"野方\",\"label\":\"現状確認、整理\",\"route\":\"笹塚 - 新宿 - 高田馬場 - 野方\",\"number\":2,\"price\":1880},\n        {\"date\":\"2025/08/06\",\"destination\":\"野方\",\"label\":\"残置物搬出\",\"route\":\"笹塚 - 新宿 - 高田馬場 - 野方\",\"number\":2,\"price\":1880},\n        {\"date\":\"2025/08/08\",\"destination\":\"上池袋\",\"label\":\"現状確認\",\"route\":\"笹塚 - 新宿 - 板橋\",\"number\":1,\"price\":640}\n      ]",
      "data": [
        {
          "date": "2024/10/08",
          "destination": "羽沢",
          "label": "現状確認",
          "route": "笹塚 - 市ヶ谷 - 新桜台",
          "number": "1",
          "price": "1240",
          "note": ""
        },
        {
          "date": "2024/11/08",
          "destination": "上池袋",
          "label": "現状確認",
          "route": "笹塚 - 新宿 - 板橋",
          "number": "1",
          "price": "640",
          "note": ""
        },
        {
          "date": "2024/12/09",
          "destination": "恵比寿",
          "label": "現状確認",
          "route": "笹塚 - 新宿 - 恵比寿",
          "number": "1",
          "price": "620",
          "note": ""
        },
        {
          "date": "2024/12/10",
          "destination": "オーシャン",
          "label": "打合せ(登記変更依頼)",
          "route": "代々木上原 - 表参道",
          "number": "1",
          "price": "360",
          "note": ""
        },
        {
          "date": "2025/01/08",
          "destination": "羽沢",
          "label": "現状確認",
          "route": "笹塚 - 市ヶ谷 - 新桜台",
          "number": "1",
          "price": "1240",
          "note": ""
        },
        {
          "date": "2024/11/10",
          "destination": "ふじやまビレジ",
          "label": "打合せ(方針論議)",
          "route": "笹塚 - 上界戸",
          "number": "2",
          "price": "14800",
          "note": "〜11/12"
        },
        {
          "date": "2025/02/08",
          "destination": "上池袋",
          "label": "現状確認",
          "route": "笹塚 - 新宿 - 板橋",
          "number": "1",
          "price": "640",
          "note": ""
        },
        {
          "date": "2025/03/01",
          "destination": "上池袋",
          "label": "SB現調",
          "route": "笹塚 - 新宿 - 板橋",
          "number": "2",
          "price": "1280",
          "note": ""
        },
        {
          "date": "2025/03/09",
          "destination": "恵比寿",
          "label": "現状確認",
          "route": "笹塚 - 新宿 - 恵比寿",
          "number": "1",
          "price": "620",
          "note": ""
        },
        {
          "date": "2025/03/26",
          "destination": "上池袋",
          "label": "SB現調",
          "route": "笹塚 - 新宿 - 板橋",
          "number": "1",
          "price": "640",
          "note": ""
        },
        {
          "date": "2025/04/08",
          "destination": "羽沢",
          "label": "現状確認",
          "route": "笹塚 - 市ヶ谷 - 新桜台",
          "number": "1",
          "price": "1240",
          "note": ""
        },
        {
          "date": "2025/05/08",
          "destination": "上池袋",
          "label": "現状確認",
          "route": "笹塚 - 新宿 - 板橋",
          "number": "1",
          "price": "640",
          "note": ""
        },
        {
          "date": "2025/05/24",
          "destination": "野方",
          "label": "現地調査",
          "route": "笹塚 - 新宿 - 高田馬場 - 野方",
          "number": "2",
          "price": "1880",
          "note": ""
        },
        {
          "date": "2025/06/08",
          "destination": "恵比寿",
          "label": "現状確認",
          "route": "笹塚 - 新宿 - 恵比寿",
          "number": "1",
          "price": "620",
          "note": ""
        },
        {
          "date": "2025/07/04",
          "destination": "野方",
          "label": "現状確認、清掃",
          "route": "笹塚 - 新宿 - 高田馬場 - 野方",
          "number": "1",
          "price": "940",
          "note": ""
        },
        {
          "date": "2025/07/08",
          "destination": "羽沢",
          "label": "現状確認",
          "route": "笹塚 - 市ヶ谷 - 新桜台",
          "number": "1",
          "price": "1240",
          "note": ""
        },
        {
          "date": "2025/07/23",
          "destination": "野方",
          "label": "現状確認、整理",
          "route": "笹塚 - 新宿 - 高田馬場 - 野方",
          "number": "2",
          "price": "1880",
          "note": ""
        },
        {
          "date": "2025/08/06",
          "destination": "野方",
          "label": "残置物搬出",
          "route": "笹塚 - 新宿 - 高田馬場 - 野方",
          "number": "2",
          "price": "1880",
          "note": ""
        },
        {
          "date": "2025/08/08",
          "destination": "上池袋",
          "label": "現状確認",
          "route": "笹塚 - 新宿 - 板橋",
          "number": "1",
          "price": "640",
          "note": ""
        }
      ]
    }
  ],
  "custom": {
    "exclude": "fn => /^(20\\d{2})(\\d{2})(\\d{2})_400_00[0|3]\\.pdf$/.test(fn)",
    "previewURL": "(id,label) => `<a href=\"https://drive.google.com/file/d/${id}/preview\" target=\"_blank\">${label}</a>`",
    "identifyType": "fileName => {\n        // 処理対象外のファイル\n        for( let rex of cf.ignore ) if( rex.test(fileName) ) return '対象外';\n        // 自動判別可能なら該当するメンバ名を、判別不可能なら「不明」を返す\n        for (const [key, value] of Object.entries(cf.classDef))\n          if (value.rex && value.rex.test(fileName)) return key;\n        return '不明';\n      }"
  },
  "created": "2025-08-18T10:50:41.223+09:00"
};