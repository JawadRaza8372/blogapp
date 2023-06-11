import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  ActivityIndicator,
  Pressable,
  FlatList,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../Utils/Colors';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const AppItem = ({item, onPress}) => {
  let navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [commentText, setcommentText] = useState('');
  const [loader, setloader] = useState(false);
  const [commentloader, setcommentloader] = useState(false);
  const [commentloaderMain, setcommentloaderMain] = useState(false);
  const [isLike_loader, setisLike_loader] = useState();
  const [data, setdata] = useState([]);
  const [likesLength, setlikesLength] = useState(
    item.likes?.length > 0 ? item.likes : [],
  );
  const [commentsLength, setcommentsLength] = useState(
    item.comments?.length > 0 ? item.comments : [],
  );
  const email = useSelector(state => state.counter.email);
  const username = useSelector(state => state.counter.username);
  const IMageUrl = useSelector(state => state.counter.IMageUrl);

  // console.log(item.id);

  const CheckComment = async () => {
    try {
      await firestore()
        .collection('blogs')
        .doc(item.id)
        .get()
        .then(dat => {
          setcommentsLength(dat.data().comments);
          setlikesLength(dat.data().likes);
        });
      setcommentloaderMain(false);
    } catch (error) {
      console.error('Error occurred while querying Firestore:', error);
      setcommentloaderMain(false);
    }
  };
  const UploadPost = val => {
    setisLike_loader(val);
    firestore()
      .collection('blogs')
      .doc(item.id)
      .get()
      .then(dat => {
        setcommentsLength(dat.data().comments);
        setlikesLength(dat.data().likes);
      })
      .finally(() => {
        firestore()
          .collection('blogs')
          .doc(item.id)
          .update({
            likes:
              likesLength?.length > 0
                ? [...likesLength, {uid: email}]
                : [{uid: email}],
          })
          .then(() => {
            setisLike_loader('');
            setlikesLength(
              likesLength?.length > 0
                ? [...likesLength, {uid: email}]
                : [{uid: email}],
            );
          })
          .catch(error => {
            setisLike_loader('');
          });
      });
  };
  const DeleteLike = async () => {
    setloader(true);
    try {
      firestore()
        .collection('blogs')
        .doc(item.id)
        .get()
        .then(dat => {
          setcommentsLength(dat.data().comments);
          setlikesLength(dat.data().likes);
        })
        .finally(() => {
          firestore()
            .collection('blogs')
            .doc(item.id)
            .update({
              likes: likesLength.filter(dat => dat.uid !== email),
            })
            .then(() => {
              setlikesLength(likesLength.filter(dat => dat.uid !== email));
              setloader(false);
            })
            .catch(error => {
              console.log(error);
              setloader(false);
            });
        });
    } catch (error) {
      setloader(false);

      console.error('Error occurred while deleting document:', error);
    }
  };

  // const CallFun = (val) => {
  //   checkLike()
  //     .then(doc => {
  //       // console.log(doc);
  //       return doc;
  //     })
  //     .catch(() => {
  //       return true;
  //     });
  // };

  // const data = [
  //   {
  //     username: 'Sheraz',
  //     email: 'hsdcv@gmail.com',
  //     Comment: 'hello',
  //   },
  //   {
  //     username: 'Sheraz',
  //     email: 'hsdcv@gmail.com',
  //     Comment: 'hello',
  //   },
  //   {
  //     username: 'Sheraz',
  //     email: 'hsdcv@gmail.com',
  //     Comment: 'hello',
  //   },
  //   {
  //     username: 'Sheraz',
  //     email: 'hsdcv@gmail.com',
  //     Comment: 'hello',
  //   },
  //   {
  //     username: 'Sheraz',
  //     email: 'hsdcv@gmail.com',
  //     Comment: 'hello',
  //   },
  //   {
  //     username: 'Sheraz',
  //     email: 'hsdcv@gmail.com',
  //     Comment: 'hello',
  //   },
  //   {
  //     username: 'Sheraz',
  //     email: 'hsdcv@gmail.com',
  //     Comment: 'hello',
  //   },
  //   {
  //     username: 'Sheraz',
  //     email: 'hsdcv@gmail.com',
  //     Comment: 'hello',
  //   },
  // ];

  const addComment = () => {
    setcommentloader(true);
    firestore()
      .collection('blogs')
      .doc(item.id)
      .get()
      .then(dat => {
        setcommentsLength(dat.data().comments);
        setlikesLength(dat.data().likes);
      })
      .finally(() => {
        firestore()
          .collection('blogs')
          .doc(item.id)
          .update({
            comments:
              commentsLength?.length > 0
                ? [
                    ...commentsLength,
                    {
                      Post_id: item.id,
                      email: email,
                      username: username,
                      commentText: commentText,
                      createdAt: Date.now(),
                      IMageUrl: IMageUrl,
                    },
                  ]
                : [
                    {
                      Post_id: item.id,
                      email: email,
                      username: username,
                      commentText: commentText,
                      createdAt: Date.now(),
                      IMageUrl: IMageUrl,
                    },
                  ],
          })
          .then(() => {
            setcommentsLength(
              commentsLength?.length > 0
                ? [
                    ...commentsLength,
                    {
                      Post_id: item.id,
                      email: email,
                      username: username,
                      commentText: commentText,
                      createdAt: Date.now(),
                      IMageUrl: IMageUrl,
                    },
                  ]
                : [
                    {
                      Post_id: item.id,
                      email: email,
                      username: username,
                      commentText: commentText,
                      createdAt: Date.now(),
                      IMageUrl: IMageUrl,
                    },
                  ],
            );
            setcommentText('');
            setcommentloader(false);
          })
          .catch(error => {
            setcommentloader(false);
            alert('Someting went wrong');
            console.log(error);
          });
      });
  };
  const deleteCommentFun = async (ind, creatred) => {
    const newdat = commentsLength?.filter(
      (dat, index) => index !== ind && dat.createdAt !== creatred,
    );
    try {
      firestore()
        .collection('blogs')
        .doc(item.id)
        .update({
          comments: newdat,
        })
        .then(() => {
          setcommentsLength(newdat);
          Alert.alert('Comment', 'Comment deleted Successfully');
        })
        .catch(error => {
          console.error('Error occurred while deleting document:', error);
        });
    } catch (error) {
      console.error('Error occurred while deleting document:', error);
    }
  };
  let checkColor = likesLength?.find(dat => dat.uid === email);
  return (
    <TouchableOpacity onPress={onPress} style={styles.MainContainer}>
      <View style={styles.ImgBg}>
        <ImageBackground
          source={{
            uri: item.imageurl,
          }}
          style={styles.ImgBg2}>
          <View style={styles.imgColor}></View>
        </ImageBackground>
      </View>
      <Text style={styles.Heading}>{item.title}</Text>
      {/* comment /like section */}
      <View style={styles.CommnetSection}>
        <TouchableOpacity
          style={{...styles.IconContainer}}
          onPress={() => {
            checkColor ? DeleteLike() : UploadPost(item.id);
          }}>
          <View style={styles.IconCC1}>
            {item.id == isLike_loader || loader ? (
              <ActivityIndicator size={'small'} />
            ) : (
              <Icon
                name={'heart'}
                size={25}
                color={checkColor ? 'red' : '#1E1E1E'}
              />
            )}
          </View>
          {loader ? (
            <ActivityIndicator size={'small'} />
          ) : (
            <Text style={styles.TextCC}>
              {likesLength?.length > 0 ? likesLength.length : 0}
              {likesLength?.length > 1 ? ' Likes' : ' Like'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setcommentloaderMain(true);
            CheckComment();
            setModalVisible(true);
          }}
          style={styles.IconContainer}>
          <View style={styles.IconCC}>
            <Icon name={'chatbubble'} size={25} color="#1E1E1E" />
          </View>
          <Text style={styles.TextCC}>
            {commentsLength?.length > 0 ? commentsLength.length : 0}
            {commentsLength?.length > 1 ? ' Comments' : ' Comment'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.topHeaderModel}>
            <Text style={styles.modalComment}>Comments</Text>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}>
              <Icon name="close" size={30} color="#0003" />
            </TouchableOpacity>
          </View>
          <View style={{height: 10}} />
          <View style={styles.modalContainerBottom}>
            {commentloaderMain ? (
              <View>
                <ActivityIndicator size={'small'} />
              </View>
            ) : (
              <FlatList
                data={commentsLength}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 15,
                    }}>
                    <View>
                      <Image
                        source={{
                          uri: item.IMageUrl
                            ? item.IMageUrl
                            : 'https://images.unsplash.com/photo-1489516408517-0c0a15662682?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
                        }}
                        style={{
                          height: 40,
                          width: 40,
                          borderRadius: 20,
                          marginRight: 10,
                        }}
                      />
                    </View>
                    <View style={{flex: 1}}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          textTransform: 'capitalize',
                        }}>
                        {item.username}
                      </Text>
                      <View
                        style={{
                          marginTop: 1,
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View
                          style={{
                            display: 'flex',
                            width: email === item.email ? '85%' : '100%',
                          }}>
                          <Text>{item.commentText}</Text>
                        </View>
                        {email === item.email ? (
                          <TouchableOpacity
                            onPress={() =>
                              deleteCommentFun(index, item.createdAt)
                            }
                            style={{
                              width: '15%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <Icon name="trash" size={25} color="#0003" />
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </View>
                    <View style={{height: 10}} />
                  </View>
                )}
              />
            )}
          </View>

          <Pressable
            disabled={true}
            style={{
              flexDirection: 'row',
              marginVertical: 5,
              position: 'absolute',
              bottom: 0,
              paddingLeft: 10,
              paddingRight: 10,
            }}
            activeOpacity={0.8}>
            <Image
              source={{
                uri: IMageUrl
                  ? IMageUrl
                  : 'https://images.unsplash.com/photo-1489516408517-0c0a15662682?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
              }}
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
                marginRight: 10,
              }}
            />
            <View
              style={{
                height: 30,
                marginTop: 5,
              }}></View>
            <View
              style={{
                width: '85%',
                // height: 100,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                // backgroundColor: 'cyan',
              }}>
              <TextInput
                style={{width: '75%'}}
                onChangeText={e => setcommentText(e)}
                value={commentText}
                placeholder="Add a Comment..."
                // style={[styles.input]}
                textAlignVertical={'top'}
                multiline={true}
                // onEndEditing={addComment}
              />
              <TouchableOpacity
                disabled={commentText ? false : true}
                style={{
                  width: '20%',
                  // backgroundColor: 'yellow',
                  alignItems: 'center',
                }}
                onPress={addComment}>
                <Text style={{color: '#000080'}}>
                  {commentText ? (
                    commentloader ? (
                      <ActivityIndicator size={'small'} />
                    ) : (
                      'send'
                    )
                  ) : null}
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

export default AppItem;

const styles = StyleSheet.create({
  MainContainer: {
    width: '100%',
    height: h('35%'),
    marginTop: 1,

    // backgroundColor: 'red',
  },
  ImgBg: {
    width: '90%',
    height: '70%',
    // backgroundColor: 'green',
    alignSelf: 'center',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  ImgBg2: {
    width: '100%',
    height: '100%',
    // backgroundColor: 'green',
    alignSelf: 'center',
    borderRadius: 10,
    resizeMode: 'cover',
    overflow: 'hidden',
  },
  Heading: {
    color: '#000',
    fontSize: h('2.2%'),
    marginLeft: 19,
    // fontWeight: 'bold',
  },
  imgColor: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0008',
  },
  CommnetSection: {
    width: '95%',
    height: '20%',
    // backgroundColor: 'green',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#0003',
    borderBottomWidth: h('0.1%'),
  },
  IconContainer: {
    // backgroundColor: 'gold',
    width: '49%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  IconContainer1: {
    width: '23%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  IconCC: {
    // backgroundColor: 'orange',
    width: '30%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  IconCC1: {
    // backgroundColor: 'orange',
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextCC: {
    color: '#1E1E1E',
    fontSize: h('2%'),
  },
  centeredView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topHeaderModel: {
    // backgroundColor: 'red',
    width: '100%',
    height: '10%',
    justifyContent: 'space-between',
    borderBottomColor: '#0003',
    paddingLeft: 10,
    borderBottomWidth: h('0.3%'),
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  modalComment: {
    color: '#0007',
    fontSize: 20,
  },
  modalContainerBottom: {
    width: '100%',
    height: '80%',
    paddingLeft: 10,
    paddingRight: 10,
  },
  font: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
