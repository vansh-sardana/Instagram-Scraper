import instaloader
import time
from datetime import datetime, timedelta
import requests

downloaded_posts = set()
to_be_sent= set()

with open('sent.txt', 'r') as f:
    while True:
        row = f.readline()
        if not row:
            break
        if(row.strip()):
            downloaded_posts.add(row)
            print(downloaded_posts)


L = instaloader.Instaloader()
def download_new_posts(username):
    global myusername, mypassword, L
    global downloaded_posts
    start_date = datetime.now() - timedelta(days=2)
    try:
        profile = instaloader.Profile.from_username(L.context, username)
        later_posts_count=0
        for post in profile.get_posts():
            print(post)
            time.sleep(2)
            post_time = post.date_utc
            if start_date <= post_time:
                post_url = post.url
                print(post_url)
                if post_url not in downloaded_posts:
                    L.download_post(post, f"instagram{start_date}")
                    print(f"New post: {post_url}")
                    downloaded_posts.add(post_url)
                    to_be_sent.add(post_url)
            else:
                later_posts_count+=1
                if (later_posts_count>4):
                   break
    except instaloader.HTTPRedirect as e:
            print("Redirected to login page. Re-logging in and recreating the session.")
            L = instaloader.Instaloader()
            L.login(myusername, mypassword)
    except Exception as e:
        print(f"An error occurred: {e}")
    time.sleep(2)

myusername = "suffixstore121"
mypassword = "Suffixstore@2024"
usernames= ["madhuridixitnene","farahkhankunder", "sushmitasen47", "malaikaaroraofficial", "deepikapadukone", "aishwaryaraibachchan_arb", "anushkasharma", "kareenakapoorkhan", "priyankachopra", "ranimukherjeefp", "parineetichopra", "aditiraohydari", "nargisfakhri", "kajol", "bipashabasu", "kiaraaliaadvani", "officialraveenatandon"]

L.login(myusername, mypassword)

for username in usernames:
    print(f"username: {username}")
    download_new_posts(username)
    print("Done")
    time.sleep(2)

with open("tobesent.txt", 'w') as file:
   for item in to_be_sent:
        file.write(str(item) + '\n')

with open("sent.txt", 'w') as file:
   for item in downloaded_posts:
        file.write(str(item) + '\n')