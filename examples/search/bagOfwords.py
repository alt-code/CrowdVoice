#!/usr/bin/python2.7
import os
import pandas as pd
import numpy as np
from pandas.io.json import json_normalize
import pprint
import json
import scipy
import gensim
if __name__ == '__main__':
    
    #Code to dummp json content
    with open('riptwitter.json', 'r') as handle:
        tweets = json.load(handle)
    # tweets is of type dict.
    # print json.dumps (tweets, indent=4, sort_keys=True)
    
    # tweets = pd.read_json('statuses.json');
    #print 'The first review is:'
    # print tweets['created_at', 'id', 'text', 'place']
    
    #Code to get tweet text for the first object
    keys = tweets.keys() 
    # print tweets[keys[0]]['text']
    # print len(keys)

    #tweet processing can come here

    tweet_text = []
    for key in keys:
        tweet_text.append(tweets[key]['text'].split(" "))
    # print tweet_text

    # pruning the internal dictionary by removing words that occur less than 10 times
    model = gensim.models.Word2Vec(tweet_text)
    # print (model.most_similar(positive=['xfinity', 'internet'], negative=['sucks'], topn=1))

    print (model.most_similar('#riptwitter'))
    # print tweets['700364193455861761']
    

