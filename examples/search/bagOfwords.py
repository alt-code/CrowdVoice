#!/usr/bin/python2.7
import os
import pandas as pd
import numpy as np
from pandas.io.json import json_normalize
import pprint
import json
import scipy
import gensim
import sys

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
    num_features = 100    # Word vector dimensionality                      
    min_word_count = 40   # Minimum word count                        
    num_workers = 4       # Number of threads to run in parallel
    context = 10          # Context window size                                                                                    
    downsampling = 1e-3   # Downsample setting for frequent words

    print "Training model..."
    model = gensim.models.Word2Vec(tweet_text, workers=num_workers, \
            size=num_features, min_count = min_word_count, \
            window = context, sample = downsampling)

    # pruning the internal dictionary by removing words that occur less than 10 times
    # model = gensim.models.Word2Vec(tweet_text)
    # print (model.most_similar(positive=['twitter', 'tweets'], negative=['riptwitter'], topn=1))

    print (model.most_similar(sys.argv[1]))
    print "Checking similarity..."
    print (model.similarity("twitter","jack"))
    # print tweets['700364193455861761']
    

