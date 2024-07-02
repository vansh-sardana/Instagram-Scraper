from instaloader import Instaloader, Profile, Post, StoryItem
from datetime import datetime, timedelta
import time

L = Instaloader()
myusername = ""
mypassword = ""
L.login(myusername, mypassword)
# usernames= ["madhuridixitnene","farahkhankunder", "sushmitasen47", "malaikaaroraofficial", "deepikapadukone", "aishwaryaraibachchan_arb", "anushkasharma", "kareenakapoorkhan", "priyankachopra", "ranimukherjeefp", "parineetichopra", "aditiraohydari", "nargisfakhri", "kajol", "bipashabasu", "kiaraaliaadvani", "officialraveenatandon"]
usernames= ["varundvn"]

profiles = [Profile.from_username(L.context, username) for username in usernames]
start_date = datetime.now() - timedelta(days=2)

def post_filter(post: Post):
    time.sleep(1)
    return post.date_utc >= start_date
def storyitem_filter(storyitem: StoryItem):
    time.sleep(1)
    print(storyitem.video_url)
    return storyitem.date_utc >= start_date

for profile in profiles:
    try:
        L.download_profiles([profile], fast_update=True, profile_pic=False, posts=False, stories=True, post_filter=post_filter, storyitem_filter=storyitem_filter)
    except KeyError as e:
        print(f"KeyError encountered for user {profile.username}: {e}. Skipping user.")
        continue