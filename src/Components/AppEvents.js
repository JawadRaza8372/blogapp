import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Pressable,
  FlatList,
  Alert,
  Modal,
} from 'react-native';
import React, {useState} from 'react';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';

const AppEvents = ({item, onPress}) => {
  const email = useSelector(state => state.counter.email);
  const username = useSelector(state => state.counter.username);
  const IMageUrl = useSelector(state => state.counter.IMageUrl);
  const [commentText, setcommentText] = useState('');

  const [commentloader, setcommentloader] = useState(false);
  const [commentloaderMain, setcommentloaderMain] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [commentsLength, setcommentsLength] = useState(
    item.comments?.length > 0 ? item.comments : [],
  );
  const CheckComment = async () => {
    try {
      await firestore()
        .collection('events')
        .doc(item.id)
        .get()
        .then(dat => {
          setcommentsLength(dat.data().comments);
        });
      setcommentloaderMain(false);
    } catch (error) {
      console.error('Error occurred while querying Firestore:', error);
      setcommentloaderMain(false);
    }
  };
  const addComment = () => {
    setcommentloader(true);
    firestore()
      .collection('events')
      .doc(item.id)
      .get()
      .then(dat => {
        setcommentsLength(dat.data().comments);
      })
      .finally(() => {
        firestore()
          .collection('events')
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
        .collection('events')
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
  return (
    <>
      <View style={styles.boxshadowdiv}>
        <TouchableOpacity onPress={onPress} style={styles.AppEventContainer}>
          <View style={styles.leftCc}>
            <Image
              style={styles.img}
              source={{
                uri: item.imageurl,
              }}
            />
          </View>
          <View style={styles.SideText}>
            <Text style={styles.Cc}>{item.Date}</Text>
            <Text style={styles.Cc2}>{item.Name}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.CommnetSection}>
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
            <Text style={styles.TextCC}>Commnet</Text>
          </TouchableOpacity>
          <View style={styles.IconContainer1}>
            <Text style={styles.TextCC}>
              {commentsLength?.length > 0 ? commentsLength.length : 0} Commnets
            </Text>
          </View>
        </View>
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
    </>
  );
};

export default AppEvents;

const styles = StyleSheet.create({
  boxshadowdiv: {
    height: h('25%'),
    shadowColor: '#000',
    paddingTop: h('0.7%'),
    paddingBottom: h('0.7%'),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: 10,
    marginTop: 10,
    elevation: 5,
    backgroundColor: '#ffffff',
  },
  AppEventContainer: {
    width: '95%',
    height: h('18%'),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  leftCc: {
    width: '30%',
    height: '100%',
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: '90%',
    height: '90%',
    borderRadius: 10,
  },
  SideText: {
    width: '65%',
    height: '100%',
    // backgroundColor: 'red',
    paddingTop: 20,
  },
  Cc: {
    color: '#3779D7',
    fontSize: h('2%'),
    fontWeight: 'bold',
  },
  Cc2: {
    color: '#000',
    fontSize: h('2.2%'),
    fontWeight: 'bold',
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
  CommnetSection: {
    width: '95%',
    height: h('4%'),
    alignSelf: 'center',
    flexDirection: 'row',
  },
  IconContainer: {
    // backgroundColor: 'gold',
    width: '30%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  IconContainer1: {
    // backgroundColor: 'gold',
    width: '25%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
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
