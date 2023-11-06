import * as React from 'react'
import Giscus from '@giscus/react';
import * as config from '@/lib/config'

import styles from './styles.module.css'
import {useDarkMode} from "@/lib/use-dark-mode";

export const PageFooter: React.FC<{
  isBlogPost: boolean
}> = ({isBlogPost}) => {
  const {isDarkMode} = useDarkMode()
  // only display comments and page actions on blog post pages
  if (isBlogPost) {
    return (
      config.giscusRepo && (<div className={styles.comments}>
        <Giscus
          id="comments"
          repo={config.giscusRepo}
          repoId={config.giscusRepoId}
          category={config.giscusCategory}
          categoryId={config.giscusCategoryId}
          mapping="title"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="bottom"
          theme={isDarkMode ? 'transparent_dark' : 'light'}
          lang="en"
          loading="lazy"
        />
      </div>)
    );
  }

  return null
}
