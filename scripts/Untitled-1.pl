[mpijittum@58856.od /data/sandcastle/boxes/www (d3426e167)]$ t SyncJobFeedUtilsTest
Trace available for this run at /logs/testpilot/testpilot.20210908-025612.1855669.log
TestPilot test runner for Facebook. See https://fburl.com/testpilot for details.
Testpilot build revision d9422e362e0f5c3d411231eb7a31180b456de8cc fbpkg 1b4e78583b447385f27e4590cf6c9093 at Wed Sep  1 22:01:14 2021 by twsvcscm from /usr/local/fbprojects/packages/testinfra.testpilot/1059/t.par
Discovering tests
Running 1 test
Started new test run: https://internalfb.com/intern/testinfra/testrun/8162774377293139
      ✓ SyncJobFeedUtilsTest 18.914 1/1 (PASSED (5))
Finished test run: https://internalfb.com/intern/testinfra/testrun/8162774377293139
Summary (total time 19.38s):
  PASS: 1
  FAIL: 0
  SKIP: 0
  FATAL: 0
  TIMEOUT: 0
  OMIT: 0

fbdbg> $vc = allpowerful(1242805505)
fbdbg> = JobFeedUploadSessionUtils::genUploadSession($vc, '1111', 111831961027476) |> prep($$)
fbkey_read key:011c945f30ce2cbafc452f39840f0256 assoc_type:833349593840387 dbid:203219 used Provisional Mode!
fbkey_read key:011c945f30ce2cbafc452f39840f0256 assoc_type:833349593840387 dbid:203219 used Provisional Mode!
fb_obj_get id:111831961027476 used Provisional Mode!
fb_obj_create id:1001200005006 used Provisional Mode!
assoc_read id1:1001200005006 assoc_type:891369125112081 used Provisional Mode!
assoc_read id1:1001200005006 assoc_type:891369125112081 used Provisional Mode!
assoc_read id1:111831961027476 assoc_type:440865247225976 used Provisional Mode!
assoc_write id1:111831961027476 assoc_type:440865247225976 used Provisional Mode!
assoc_write id1:1001200005006 assoc_type:891369125112081 used Provisional Mode!
fbkey_read key:011c945f30ce2cbafc452f39840f0256 assoc_type:833349593840387 dbid:203219 used Provisional Mode!
fbkey_read key:011c945f30ce2cbafc452f39840f0256 assoc_type:833349593840387 dbid:203219 used Provisional Mode!
fbkey_write key:011c945f30ce2cbafc452f39840f0256 assoc_type:833349593840387 dbid:203219 used Provisional Mode!
EntJobFeedUploadSession : 1001200005006
fbdbg> = JobFeedUploadSessionUtils::genUploadSession($vc, '1111', 111831961027476) |> prep($$)
fbkey_read key:011c945f30ce2cbafc452f39840f0256 assoc_type:833349593840387 dbid:203219 used Provisional Mode!
fbkey_read key:011c945f30ce2cbafc452f39840f0256 assoc_type:833349593840387 dbid:203219 used Provisional Mode!
EntJobFeedUploadSession : 1001200005006
fbdbg> = JobFeedUploadSessionUtils::genUploadSession($vc, '1112', 111831961027476) |> prep($$)
fbkey_read key:7161a2409087e392cf68559ddac9f1b6 assoc_type:833349593840387 dbid:142371 used Provisional Mode!
fbkey_read key:7161a2409087e392cf68559ddac9f1b6 assoc_type:833349593840387 dbid:142371 used Provisional Mode!
fb_obj_create id:1001200005007 used Provisional Mode!
assoc_read id1:1001200005007 assoc_type:891369125112081 used Provisional Mode!
assoc_read id1:1001200005007 assoc_type:891369125112081 used Provisional Mode!
assoc_read id1:111831961027476 assoc_type:440865247225976 used Provisional Mode!
assoc_write id1:111831961027476 assoc_type:440865247225976 used Provisional Mode!
assoc_write id1:1001200005007 assoc_type:891369125112081 used Provisional Mode!
fbkey_read key:7161a2409087e392cf68559ddac9f1b6 assoc_type:833349593840387 dbid:142371 used Provisional Mode!
fbkey_read key:7161a2409087e392cf68559ddac9f1b6 assoc_type:833349593840387 dbid:142371 used Provisional Mode!
fbkey_write key:7161a2409087e392cf68559ddac9f1b6 assoc_type:833349593840387 dbid:142371 used Provisional Mode!
EntJobFeedUploadSession : 1001200005007


EntJobFeedUploadSession : 1001200005007
fbdbg> = $session = JobFeedUploadSessionUtils::genUploadSession($vc, '1112', 111831961027476) |> prep($$)
fbkey_read key:7161a2409087e392cf68559ddac9f1b6 assoc_type:833349593840387 dbid:142371 used Provisional Mode!
fbkey_read key:7161a2409087e392cf68559ddac9f1b6 assoc_type:833349593840387 dbid:142371 used Provisional Mode!
EntJobFeedUploadSession : 1001200005007
fbdbg> = JobFeedUploadSessionUtils::genAddEvent($vc, $session, "text_event" , "test message") |> prep($$)
fb_obj_create id:1001200005008 used Provisional Mode!
assoc_read id1:1001200005008 assoc_type:1082709332533186 used Provisional Mode!
assoc_read id1:1001200005008 assoc_type:1082709332533186 used Provisional Mode!
assoc_read id1:1001200005007 assoc_type:535735270870190 used Provisional Mode!
assoc_write id1:1001200005007 assoc_type:535735270870190 used Provisional Mode!
assoc_write id1:1001200005008 assoc_type:1082709332533186 used Provisional Mode!
null
fbdbg> = JobFeedUploadSessionUtils::genAddEvent($vc, $session, "text_event2" , "test message2") |> prep($$)
fb_obj_create id:1001200005009 used Provisional Mode!
assoc_read id1:1001200005009 assoc_type:1082709332533186 used Provisional Mode!
assoc_read id1:1001200005009 assoc_type:1082709332533186 used Provisional Mode!
assoc_read id1:1001200005007 assoc_type:535735270870190 used Provisional Mode!
assoc_write id1:1001200005007 assoc_type:535735270870190 used Provisional Mode!
assoc_write id1:1001200005009 assoc_type:1082709332533186 used Provisional Mode!
null

fbdbg> = JobFeedUploadSessionUtils::genEvents($vc, $session) |> prep($$)
assoc_read id1:1001200005007 assoc_type:535735270870190 used Provisional Mode!
assoc_read id1:1001200005007 assoc_type:535735270870190 used Provisional Mode!
fb_obj_get id:1001200005009 used Provisional Mode!
fb_obj_get id:1001200005009 used Provisional Mode!
fb_obj_get id:1001200005008 used Provisional Mode!
fb_obj_get id:1001200005008 used Provisional Mode!
Dict
(
    [1001200005009] => EntJobFeedUploadSessionEvent : 1001200005009
    [1001200005008] => EntJobFeedUploadSessionEvent : 1001200005008
)