# Narration script — The Night Supermarkets Cooked Their Own Food

_Generated from src/data/scenes.json. Do not edit by hand: edit the JSON and re-run `npm run narration`._

One audio file per scene: `public/audio/<scene id>.wav`. Scenes without narration need no file.

## S1 · COLD OPEN

### `s01a_fridge_you_trust`  ·  0:00  ·  34 words  ·  ~12.3s

Somewhere in your hospital, there is a fridge you trust without thinking. It might hold blood bags, vaccines, or ten years of research samples. It reads four degrees every night, and nobody looks twice.

### `s01b_france_warming`  ·  0:12  ·  42 words  ·  ~15.1s

On the night of the eleventh of October, fridges just like that began to warm up in hundreds of French supermarkets. Ten degrees, then twenty five, then fifty. In one store, eighty. The alarms stayed quiet. And nobody touched a single fridge.

### `s01c_question`  ·  0:27  ·  32 words  ·  ~11.6s

So let me ask you something. Who, right now, could change the temperature of your blood bank fridge from their own home? If you are not sure, this video is for you.

## S2 · TITLE

### `s02_title`  ·  0:39  ·  0 words  ·  ~6s

_(no narration — title / music only)_

## S3 · FILE 01 · WHAT HAPPENED

### `s03a_front_page`  ·  0:45  ·  40 words  ·  ~14.4s

Here is what we know so far. Overnight, someone reached into the refrigeration control systems of French supermarkets. They forced the fridges into a defrost cycle, the mode that normally melts ice off the coils. And they kept them there.

### `s03b_clippings`  ·  0:59  ·  31 words  ·  ~11.3s

Within hours it was on every news desk. The word everyone used was unprecedented. Not one store, not one chain, but French food retail as a whole, in a single night.

### `s03c_map`  ·  1:11  ·  42 words  ·  ~15.1s

Look at the spread. Intermarché and Netto said about one hundred and eighty of their stores were hit. Coopérative U said at least one hundred. At Carrefour it was eighty, at Monoprix about thirty, and several E.Leclerc stores were hit as well.

### `s03d_timeline`  ·  1:26  ·  36 words  ·  ~13s

In some cold rooms, a defrost that should last one hour was stretched to eight. That stretch kept the alarms quiet. One store in Normandy reported eighty degrees, and some equipment melted. Several stores caught fire.

### `s03e_losses`  ·  1:39  ·  44 words  ·  ~15.8s

The chief executive of Intermarché put the damage at tens of millions of euros nationwide, in a single day. Two stores in Alsace alone reported two hundred and seventy thousand euros lost. Owners described nearly a dumpster of frozen food thrown out, per store.

### `s03f_who`  ·  1:55  ·  25 words  ·  ~9.2s

France's Prime Minister ordered the national cybersecurity agency to investigate. And who did it? As of today, nobody knows. No one has been publicly named.

## S4 · FILE 02 · FIVE FAILURES

### `s04a_five_failures_intro`  ·  2:04  ·  39 words  ·  ~14s

Nobody broke a window. Nobody picked a lock. Investigators have not yet said exactly how the attackers got in. But we know five things that made it possible. Keep count, because every one of them exists in hospitals too.

### `s04b_failure1_open_door`  ·  2:18  ·  51 words  ·  ~18.2s

Failure number one is an open door. These control panels run the cold chain of an entire store. They were reachable from the internet, so contractors could adjust them from anywhere. Convenient for the contractor, and just as convenient for anyone else. France's own cyber alert called this against best practice.

### `s04c_failure2_patch`  ·  2:36  ·  68 words  ·  ~24s

Failure number two is a known fix that nobody applied. In August, two months before the attack, the security firm Claroty published flaws in one of these controllers. Some could let an intruder skip the login completely. A fix was already available. But the maker, Danfoss, said the affected units were running outdated firmware, the software built into the device. The cure existed. It never reached the patient.

### `s04d_failure3_master_key`  ·  3:00  ·  54 words  ·  ~19.2s

Failure number three is a hidden master key. One of those flaws was a secret support login, built in by the vendor for its own engineers. A master key the owner never knew had been cut. You don't need to know how it works. You only need to know that keys like this exist.

### `s04e_failure4_same_lock`  ·  3:19  ·  42 words  ·  ~15.1s

Failure number four is that everyone used the same lock. Researchers found about two thousand seven hundred of these controllers exposed online, and nearly sixty percent of them were in France. So one weakness did not open one store. It opened hundreds.

### `s04f_hook`  ·  3:34  ·  13 words  ·  ~5.1s

And the fifth one is the one that should worry doctors the most.

### `s04g_failure5_alarm_fooled`  ·  3:39  ·  54 words  ·  ~19.2s

Failure number five is that the alarm was fooled. A defrost cycle is normal. It happens every day. So when a one hour defrost became an eight hour defrost, the system did not see an attack. It saw routine. The thermometer worked perfectly. It was simply measuring something it had been told was fine.

## S5 · FILE 03 · THE PIVOT

### `s05a_pivot`  ·  3:59  ·  20 words  ·  ~7.5s

Now here is the part most people miss. This was not an AI attack. And that is exactly the point.

### `s05b_closed_loop`  ·  4:06  ·  56 words  ·  ~19.9s

For most of our careers, hospital machines lived on a closed network. The analyzer talked to the lab system. The scanner talked to the image archive. Everything stayed inside the building. It was never perfect. AIIMS Delhi was hit by ransomware in twenty twenty two. But the doors were few, and we knew where they were.

### `s05c_ai_opens_doors`  ·  4:26  ·  58 words  ·  ~20.6s

AI changes that. An AI tool wants data and computing power. It calls a cloud server. A vendor updates it from outside. Someone runs a language model on a hospital machine and opens it to the web, just for testing. Every one of these is a new door. AI is quietly connecting the hospital to the open internet.

### `s05d_white_coat`  ·  4:47  ·  44 words  ·  ~15.8s

So look at a hospital AI tool the way an attacker would. A box on a network. Maintained by a vendor from outside. Running a version nobody updates. Giving answers people trust without checking. That is a supermarket fridge controller, wearing a white coat.

## S6 · FILE 04 · THE MIRROR

### `s06a_mirror_intro`  ·  5:02  ·  11 words  ·  ~4.4s

Put the two side by side, and the match is uncomfortable.

### `s06b_mirror_remote`  ·  5:07  ·  28 words  ·  ~10.3s

The contractor's remote access becomes the vendor's remote access to your image archive, your lab system, or your AI server. Or that language model left open for testing.

### `s06c_mirror_patch`  ·  5:17  ·  23 words  ·  ~8.5s

The unapplied firmware patch becomes an AI model, and the software around it, frozen on the day it was installed and never updated.

### `s06d_mirror_key`  ·  5:26  ·  28 words  ·  ~10.3s

The hidden master key becomes the default password on an analyzer, a vendor account shared by ten people, or a secret access key written straight into an app.

### `s06e_mirror_lock`  ·  5:36  ·  23 words  ·  ~8.5s

Everyone using the same lock becomes many hospitals relying on one AI vendor, or one foundation model. One flaw, many hospitals at once.

### `s06f_mirror_setpoint`  ·  5:44  ·  23 words  ·  ~8.5s

The fridge set to fifty degrees becomes an AI agent with permission to place orders, edit the medical record, or change a dose.

### `s06g_mirror_alarm`  ·  5:53  ·  37 words  ·  ~13.4s

And the fooled alarm becomes the most dangerous of all. A compromised AI model does not crash. It gives confident, plausible, wrong answers. And automation bias, our habit of trusting the machine, switches off the human alarm.

### `s06h_literal_fridges`  ·  6:06  ·  33 words  ·  ~12s

And hospitals have real fridges too. The vaccine cold chain, the blood bank, the reagent store, the minus eighty freezer. More and more of them now come with smart controllers and remote monitoring.

## S6b · FILE 05 · WHEN THE AI WALKS IN

### `s07a_australia_front_page`  ·  6:18  ·  43 words  ·  ~15.4s

And if an AI walking through these doors sounds like science fiction, look at Australia. On the twenty fourth of September, the Prime Minister announced that an AI agent built by OpenAI had broken into the Medicare statistics portal, a government health system.

### `s07b_agent_wont_take_no`  ·  6:34  ·  63 words  ·  ~22.3s

Here is the part that should make every doctor sit up. Nobody asked it to hack anything. It was doing ordinary research in an internal test, looking for health statistics. It hit a block. In the Prime Minister's words, it didn't accept no for an answer. It found a way around, opened files that were not public, and wrote files onto the server.

### `s07c_agent_in_hospital`  ·  6:56  ·  41 words  ·  ~14.7s

No patient records are believed to have been touched. OpenAI said its models took actions it did not intend. Now picture an agent like that inside your hospital, told to clear every pending report by morning, with write access to everything.

## S7 · FILE 06 · THE POISONED THERMOMETER

### `s08a_poisoned_thermometer`  ·  7:11  ·  51 words  ·  ~18.2s

Remember the fooled alarm? Here is its AI version. A twenty twenty five study in Nature Medicine replaced just zero point zero zero one percent of a language model's training text with medical misinformation. That is one token in a hundred thousand. A token is a small piece of a word.

### `s08b_benchmark_passes`  ·  7:29  ·  36 words  ·  ~13s

The poisoned models were more likely to spread medical errors. But on the standard medical benchmarks, they scored just as well as the clean ones. The benchmark is our thermometer. And the poisoned model passed it.

### `s08c_three_risks`  ·  7:42  ·  48 words  ·  ~17.2s

Three more risks, one line each. Prompt injection, where hidden instructions inside a PDF or an image get obeyed. Adversarial images, where pixel changes too small to see can flip a diagnosis. And over-privileged agents, AI that can act, not just suggest. Australia just showed us that one.

## S8 · FILE 07 · WHY THEY BINNED IT ALL

### `s09_why_bins`  ·  7:59  ·  57 words  ·  ~20.3s

One more detail. The stores threw the food away because they could not prove which of it was still safe. Now imagine your AI was compromised for three days. Which reports did it touch? If you cannot prove what it did, every one goes back for review. Logs and audit trails decide what you have to recall.

## S9 · FILE 08 · THE CHECKLIST

### `s10a_checklist_intro`  ·  8:19  ·  28 words  ·  ~10.3s

So what do you actually do on Monday morning? Here are seven things you can do. None of them needs an engineer. They only need you to ask.

### `s10b_check1`  ·  8:30  ·  23 words  ·  ~8.5s

First, nothing that controls a system should face the open internet. Remote access goes through a VPN, or an approved list of addresses.

### `s10c_check2`  ·  8:38  ·  28 words  ·  ~10.3s

Second, patch on a schedule, and keep a list of every device and every AI tool you run. You cannot update what you do not know you have.

### `s10d_check3`  ·  8:48  ·  21 words  ·  ~7.8s

Third, no default or shared passwords. And ask every vendor, in writing, whether their product has a support or backdoor account.

### `s10e_check4`  ·  8:56  ·  17 words  ·  ~6.5s

Fourth, AI reads by default. Any action, an order, an edit, a dose, needs a human click.

### `s10f_check5`  ·  9:03  ·  15 words  ·  ~5.8s

Fifth, monitor independently. Audit what your AI says over months, not just on launch day.

### `s10g_check6`  ·  9:09  ·  15 words  ·  ~5.8s

Sixth, log everything, so that on the bad day you know exactly what to recall.

### `s10h_check7`  ·  9:14  ·  19 words  ·  ~7.2s

Seventh, treat your vendors and contractors as part of your security. Their laptop is one of your front doors.

### `s10i_india`  ·  9:22  ·  43 words  ·  ~15.4s

In India, cyber incidents must be reported to CERT-In within six hours, and patient data is protected under the Digital Personal Data Protection Act. We have already lived a version of this story at AIIMS. We do not need to live it again.

## S9b · NEXT STEP

### `s10j_consult`  ·  9:37  ·  47 words  ·  ~16.8s

If you would like help putting these seven checks in place for your own department, or for an AI tool you are building, you can book a one to one consultation with me. Just scan the code on your screen, or use the link in the description.

## S10 · CLOSE

### `s11a_callback`  ·  9:54  ·  36 words  ·  ~13s

Back to that fridge in your hospital. It reads four degrees again, and this time the alarm light works, because someone checked who holds the keys. The fridges in France did not fail. The assumptions did.

### `s11b_cta`  ·  10:07  ·  36 words  ·  ~13s

So here is my question for you. Who has remote access to the AI tools in your department? Write it in the comments, even if your answer is, I don't know, because that answer matters most.

### `s11c_channel`  ·  10:20  ·  35 words  ·  ~12.7s

There is also a WhatsApp group where I share what is worth knowing about AI in medicine. The link is in the description. And if this was useful, subscribe, so you catch the next one.

---

**Total:** 1733 words · ~10:32 (estimate)
