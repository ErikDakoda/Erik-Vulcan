import React from 'react';
import PropTypes from 'prop-types';
import { registerComponent, getComponent } from 'meteor/vulcan:lib';
import createReactClass from 'create-react-class';
import Dropzone from 'react-dropzone';
import withStyles from '@material-ui/core/styles/withStyles';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import ComponentMixin from 'meteor/vulcan:ui-material/lib/components/forms/base-controls/mixins/component';
import MuiFormControl from 'meteor/vulcan:ui-material/lib/components/forms/base-controls/MuiFormControl';
import MuiFormHelper from 'meteor/vulcan:ui-material/lib/components/forms/base-controls/MuiFormHelper';
import classNames from 'classnames';

/*

Material UI GUI for Cloudinary Image Upload component

*/

const styles = theme => ({
  root: {},


  uploadField: {
    marginTop: theme.spacing(1),
  },

  dropzoneBase: {
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: theme.palette.background[900],
    backgroundColor: theme.palette.background[100],
    color: theme.palette.common.lightBlack,
    padding: '30px 60px',
    transition: 'all 0.5s',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&[aria-disabled="false"]:hover': {
      color: theme.palette.common.midBlack,
      borderColor: theme.palette.background['A200'],
    },
  },

  dropzoneActive: {
    borderStyle: 'solid',
    borderColor: theme.palette.info.main,
  },

  dropzoneAccept: {
    borderStyle: 'solid',
    borderColor: theme.palette.success.main,
  },

  dropzoneReject: {
    borderStyle: 'solid',
    borderColor: theme.palette.warning.main,
  },

  uploadState: {},

  uploadImages: {
    border: `1px solid ${theme.palette.background[500]}`,
    backgroundColor: theme.palette.background[100],
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(0.5),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(0.5),
  },
});


const UploadInner = createReactClass({

  mixins: [ComponentMixin],

  displayName: 'UploadInner',

  render: function () {

    const {
      uploading,
      images,
      disabled,
      maxCount,
      options,
      enableMultiple,
      onDrop,
      isDeleted,
      clearImage,
      classes,
    } = this.props;

    const UploadImage = getComponent(options.uploadImageComponentName || 'UploadImage');

    return (
      <MuiFormControl {...this.getFormControlProperties()} fakeLabel={true} htmlFor={this.getId()}>

        <MuiFormHelper {...this.getFormHelperProperties()}/>

        <div className={classes.uploadField}>
          {
            !enableMultiple && images.length
              ?
              null
              :
              <Dropzone
                onDrop={onDrop}
                disabled={disabled}
                accept="image/*"
                multiple={enableMultiple}
              >
                {dropzoneProps => {
                  const {
                    getRootProps,
                    getInputProps,
                    isDragActive,
                    isDragAccept,
                    isDragReject
                  } = dropzoneProps;

                  const className = classNames(
                    classes.dropzoneBase,
                    isDragActive && classes.dropzoneActive,
                    isDragAccept && classes.dropzoneAccept,
                    isDragReject && classes.dropzoneReject,
                  );

                  return (
                    <div {...getRootProps({ className, style: options.dropzoneStyle })}>
                      <input {...getInputProps()} />
                      <div>
                        <FormattedMessage id={`upload.${disabled ? 'maxReached' : 'prompt'}`}
                                          values={{ maxCount }}/>
                      </div>
                      {
                        uploading &&
                        <div className="upload-uploading">
                          <span>
                            <FormattedMessage id={'upload.uploading'}/>
                          </span>
                        </div>
                      }
                    </div>
                  );
                }}
              </Dropzone>
          }

          {!!images.length && (
            <div className={classes.uploadState}>
              <div className={classes.uploadImages}>
                {images.map(
                  (image, index) =>
                    !isDeleted(index) && (
                      <UploadImage
                        clearImage={clearImage}
                        key={index}
                        index={index}
                        image={image}
                        loading={image.loading}
                        preview={image.preview}
                        error={image.error}
                        style={options.imageStyle}
                      />
                    )
                )}
              </div>
            </div>
          )}
        </div>

      </MuiFormControl>
    );
  }
});

UploadInner.propTypes = {
  uploading: PropTypes.bool,
  images: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
  maxCount: PropTypes.number.isRequired,
  options: PropTypes.object.isRequired,
  enableMultiple: PropTypes.bool,
  onDrop: PropTypes.func.isRequired,
  isDeleted: PropTypes.func.isRequired,
  clearImage: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

UploadInner.displayName = 'UploadInnerMui';

registerComponent('UploadInner', UploadInner, [withStyles, styles]);
