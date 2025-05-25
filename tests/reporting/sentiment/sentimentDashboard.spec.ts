import { test } from '../../setup';
import Login from '../../../pages/components/login';
import sentimentDashboardPage from '../../../pages/reporting/Sentiment/SentimentPage';

test.use({ viewport: { width: 1920, height: 1080 } });


test.describe("Validate Sentiment Dashboard loads for SP 2510 @sentimentFE", async () => {
  test('Sentiment dashboard UI check', async ({ page }) => {
    await test.step('Login as admin', async () => {
        await page.goto(`${process.env.LOGIN_URL}`)
        const login = new Login(page)
        await login.userLogin('sentiment2510@uberall.com', process.env.LB_DEFAULT_PASSWORD)
  
      })
      
      const sentiment = new sentimentDashboardPage(page)
  
      await test.step("proceed to Sentiment Dashboard page", async () => {
        await sentiment.navigateToSentimentDashboard()
      })
  
      await test.step("Wait for Dashboard to Load", async () => {
        await sentiment.verifyDashboardLoad()
      })

      await test.step("Open Filters", async () => {
        await sentiment.filtersCheck()
      })
  
    });

  })
  
  test.describe("Validate Keywords Modal shows for SP 2510 @sentimentFE", async () => {
    test('View Keywords Modal', async ({ page }) => {
      await test.step('Login as admin', async () => {
          await page.goto(`${process.env.LOGIN_URL}`)
          const login = new Login(page)
          await login.userLogin('sentiment2510@uberall.com', process.env.LB_DEFAULT_PASSWORD)
    
        })
        
        const sentiment = new sentimentDashboardPage(page)
    
        await test.step("proceed to Sentiment Dashboard page", async () => {
          await sentiment.navigateToSentimentDashboard()
        })
  
    
        await test.step("Wait for Dashboard to Load", async () => {
          await sentiment.verifyDashboardLoad()
        })
  
        await test.step("Open Keywords Modal", async () => {
          await sentiment.verifyWordcloudModal()
        })
    
      });
  
    })

    test.describe("View Context Pane for Keywords Trending Up @sentimentFE", async () => {
      test('Validate a context pane shows up for any keyword trending Up', async ({ page }) => {
        await test.step('Login as admin', async () => {
            await page.goto(`${process.env.LOGIN_URL}`)
            const login = new Login(page)
            await login.userLogin('sentiment2510@uberall.com', process.env.LB_DEFAULT_PASSWORD)
      
          })
          
          const sentiment = new sentimentDashboardPage(page)
      
          await test.step("proceed to Sentiment Dashboard page", async () => {
            await sentiment.navigateToSentimentDashboard()
          })
    
      
          await test.step("Wait for Dashboard to Load", async () => {
            await sentiment.verifyDashboardLoad()
          })

    
          await test.step("Open Any Trending Up Keywords context Pane", async () => {
            await sentiment.clickOnTrendingThemes('Trending Up')
          })
      
        });
    
      })

      test.describe("View Context Pane for Keywords Trending Down @sentimentFE", async () => {
        test('Validate a context pane shows up for any keyword trending Down', async ({ page }) => {
          await test.step('Login as admin', async () => {
              await page.goto(`${process.env.LOGIN_URL}`)
              const login = new Login(page)
              await login.userLogin('sentiment2510@uberall.com', process.env.LB_DEFAULT_PASSWORD)
        
            })
            
            const sentiment = new sentimentDashboardPage(page)
        
            await test.step("proceed to Sentiment Dashboard page", async () => {
              await sentiment.navigateToSentimentDashboard()
            })
      
        
            await test.step("Wait for Dashboard to Load", async () => {
              await sentiment.verifyDashboardLoad()
            })

      
            await test.step("Open Any Trending Down Keywords context Pane", async () => {
              await sentiment.clickOnTrendingThemes("Trending Down")
            })
        
          });
      
        })

        test.describe("View First Location on Dashboard @sentimentFE", async () => {
          test('Validate you can open up the first location shown on the dashboard', async ({ page }) => {
            await test.step('Login as admin', async () => {
                await page.goto(`${process.env.LOGIN_URL}`)
                const login = new Login(page)
                await login.userLogin('sentiment2510@uberall.com', process.env.LB_DEFAULT_PASSWORD)
          
              })
              
              const sentiment = new sentimentDashboardPage(page)
          
              await test.step("proceed to Sentiment Dashboard page", async () => {
                await sentiment.navigateToSentimentDashboard()
              })
        
          
              await test.step("Wait for Dashboard to Load", async () => {
                await sentiment.verifyDashboardLoad()
              })
        
              await test.step("Open the first location context pane by clicking on its score button", async () => {
                await sentiment.verifyFirstLocationOnList()
              })
          
            });
        
          })

          test.describe("Verify the Theme Selector on Location Dashboard @sentimentFE", async () => {
            test('Validate you can view the theme columns in location dashboard', async ({ page }) => {
              await test.step('Login as admin', async () => {
                  await page.goto(`${process.env.LOGIN_URL}`)
                  const login = new Login(page)
                  await login.userLogin('sentiment2510@uberall.com', process.env.LB_DEFAULT_PASSWORD)
            
                })
                
                const sentiment = new sentimentDashboardPage(page)
            
                await test.step("proceed to Sentiment Dashboard page", async () => {
                  await sentiment.navigateToSentimentDashboard()
                })
          
            
                await test.step("Wait for Dashboard to Load", async () => {
                  await sentiment.verifyDashboardLoad()
                })

                await test.step("Verify Themes Selector", async () => {
                  await sentiment.verifyThemesSelectorOnLocationDashboard()
                })

              });
          
            })


          test.describe("Verify you can remove all themes from Location Dashboard @sentimentFE", async () => {
            test('Validate you can remove all the themes from the location dashboard', async ({ page }) => {
              await test.step('Login as admin', async () => {
                  await page.goto(`${process.env.LOGIN_URL}`)
                  const login = new Login(page)
                  await login.userLogin('sentiment2510@uberall.com', process.env.LB_DEFAULT_PASSWORD)
            
                })
                
                const sentiment = new sentimentDashboardPage(page)
            
                await test.step("proceed to Sentiment Dashboard page", async () => {
                  await sentiment.navigateToSentimentDashboard()
                })
          
            
                await test.step("Wait for Dashboard to Load", async () => {
                  await sentiment.verifyDashboardLoad()
                })

                await test.step("Remove all themes from the location Dashboard", async () => {
                  await sentiment.removeAllThemesFromDashboard()
                })

                await test.step("verify all themes from the location Dashboard are hidden", async () => {
                  await sentiment.verifyThemesColumnHide()
                })

              });
          
            })

            test.describe("Verify you can reset the theme selection on Location Dashboard @sentimentFE", async () => {
              test('Validate you can reset to the initial state all the themes selected from the location dashboard', async ({ page }) => {
                await test.step('Login as admin', async () => {
                    await page.goto(`${process.env.LOGIN_URL}`)
                    const login = new Login(page)
                    await login.userLogin('sentiment2510@uberall.com', process.env.LB_DEFAULT_PASSWORD)
              
                  })
                  
                  const sentiment = new sentimentDashboardPage(page)
              
                  await test.step("proceed to Sentiment Dashboard page", async () => {
                    await sentiment.navigateToSentimentDashboard()
                  })
            
              
                  await test.step("Wait for Dashboard to Load", async () => {
                    await sentiment.verifyDashboardLoad()
                  })
  
                  await test.step("Remove all themes from the location Dashboard", async () => {
                    await sentiment.removeAllThemesFromDashboard()
                  })
  
                  await test.step("verify all themes from the location Dashboard are hidden", async () => {
                    await sentiment.verifyThemesColumnHide()
                  })

                  await test.step("Verify you can click on reset ", async () => {
                    await sentiment.resetThemeColumn()
                  })

                  await test.step("Verify all the themes are shown again", async () => {
                    await sentiment.verifyThemesColumnAreVisible()
                  })
  
                });
            
              })

            test.describe("Verify you can remove some themes from Location Dashboard @sentimentFE", async () => {
              test('Validate you can remove some of the themes from the location dashboard', async ({ page }) => {
                await test.step('Login as admin', async () => {
                    await page.goto(`${process.env.LOGIN_URL}`)
                    const login = new Login(page)
                    await login.userLogin('sentiment2510@uberall.com', process.env.LB_DEFAULT_PASSWORD)
              
                  })
                  
                  const sentiment = new sentimentDashboardPage(page)
              
                  await test.step("proceed to Sentiment Dashboard page", async () => {
                    await sentiment.navigateToSentimentDashboard()
                  })
            
              
                  await test.step("Wait for Dashboard to Load", async () => {
                    await sentiment.verifyDashboardLoad()
                  })
  
                  await test.step("Hide random theme columns from the location Dashboard", async () => {
                    await sentiment.hideRandomColumns()
                  })
  
                });
            
              })



          test.describe("Filter Location Dashboard by Score @sentimentFE", async () => {
            test.use({ viewport: { width: 1920, height: 1080 } });
            test('Validate you filter the dashboard by scores', async ({ page }) => {
              await test.step('Login as admin', async () => {
                  await page.goto(`${process.env.LOGIN_URL}`)
                  const login = new Login(page)
                  await login.userLogin('sentiment2510@uberall.com', process.env.LB_DEFAULT_PASSWORD)
            
                })
                
                const sentiment = new sentimentDashboardPage(page)
            
                await test.step("proceed to Sentiment Dashboard page", async () => {
                  await sentiment.navigateToSentimentDashboard()
                })
          
            
                await test.step("Wait for Dashboard to Load", async () => {
                  await sentiment.verifyDashboardLoad()
                })

          
                await test.step("Filter By Scores - Location Dashboard is refreshed with locations that match the Score criteria", async () => {
                  await sentiment.verifyFilteredLocationsByScore()
                })
            
              });
          
            })

            test.describe("Verify you can export the sentiment dashboard chart data @sentimentFE", async () => {
              test('Validate you are able to export the sentiment chart data', async ({ page }) => {
                await test.step('Login as admin', async () => {
                    await page.goto(`${process.env.LOGIN_URL}`)
                    const login = new Login(page)
                    await login.userLogin('sentiment2510@uberall.com', process.env.LB_DEFAULT_PASSWORD)
              
                  })
                  
                  const sentiment = new sentimentDashboardPage(page)
              
                  await test.step("proceed to Sentiment Dashboard page", async () => {
                    await sentiment.navigateToSentimentDashboard()
                  })
            
              
                  await test.step("Wait for Dashboard to Load", async () => {
                    await sentiment.verifyDashboardLoad()
                  })
      
            
                  await test.step("Click on Dashboard Export", async () => {
                    await sentiment.clickOnExportReport()
                  })
              
                });
            
              })

              test.describe("Verify you can export the context pane feed data @sentimentFE", async () => {
                test('Validate you are able to export the context pane feed data', async ({ page }) => {
                  await test.step('Login as admin', async () => {
                      await page.goto(`${process.env.LOGIN_URL}`)
                      const login = new Login(page)
                      await login.userLogin('sentiment2510@uberall.com', process.env.LB_DEFAULT_PASSWORD)
                
                    })
                    
                    const sentiment = new sentimentDashboardPage(page)
                
                    await test.step("proceed to Sentiment Dashboard page", async () => {
                      await sentiment.navigateToSentimentDashboard()
                    })
              
                
                    await test.step("Wait for Dashboard to Load", async () => {
                      await sentiment.verifyDashboardLoad()
                    })
        

                    await test.step("Open the first location context pane by clicking on its score button", async () => {
                      await sentiment.verifyFirstLocationOnList()
                    })
              
                    await test.step("Click on Dashboard Export", async () => {
                      await sentiment.clickOnExportFeedReport()
                    })
                
                  });
              
                })


            test.describe("Validate Sentiment Dashboard loads for SP 2510- Single Location Manager @sentimentFE", async () => {
              test('Sentiment dashboard UI check for Single Location Manager', async ({ page }) => {
                await test.step('Login as admin', async () => {
                    await page.goto(`${process.env.LOGIN_URL}`)
                    const login = new Login(page)
                    await login.userLogin('locationManager_2510@uberall.com', process.env.LB_DEFAULT_PASSWORD)
              
                  })
                  
                  const sentiment = new sentimentDashboardPage(page)
              
                  await test.step("proceed to Sentiment Dashboard page", async () => {
                    await sentiment.navigateToSentimentDashboard()
                  })


                  await test.step("Wait for Dashboard to Load", async () => {
                    await sentiment.verifyDashboardLoadForSingleLocationManager()
                  })
            
                  await test.step("Open Filters", async () => {
                    await sentiment.filtersCheckForLocationManager()
                  })
              
                });
            
              })

              test.describe("View Keywords Modal - Single Location Manager @sentimentFE", async () => {
                test('View Keywords Modal for single Location Manager', async ({ page }) => {
                  await test.step('Login as admin', async () => {
                      await page.goto(`${process.env.LOGIN_URL}`)
                      const login = new Login(page)
                      await login.userLogin('locationManager_2510@uberall.com', process.env.LB_DEFAULT_PASSWORD)
                
                    })
                    
                    const sentiment = new sentimentDashboardPage(page)
                
                    await test.step("proceed to Sentiment Dashboard page", async () => {
                      await sentiment.navigateToSentimentDashboard()
                    })
              
                
                    await test.step("Wait for Dashboard to Load", async () => {
                      await sentiment.verifyDashboardLoadForSingleLocationManager()
                    })
              
                    await test.step("Open Keywords Modal", async () => {
                      await sentiment.verifyWordcloudModal()
                    })
                
                  });
              
                })

                test.describe("View Context Pane for Keywords Trending Up for Single Location Manager @sentimentFE", async () => {
                  test('Validate a context pane shows up for any keyword trending Up', async ({ page }) => {
                    await test.step('Login as admin', async () => {
                        await page.goto(`${process.env.LOGIN_URL}`)
                        const login = new Login(page)
                        await login.userLogin('locationManager_2510@uberall.com', process.env.LB_DEFAULT_PASSWORD)
                  
                      })
                      
                      const sentiment = new sentimentDashboardPage(page)
                  
                      await test.step("proceed to Sentiment Dashboard page", async () => {
                        await sentiment.navigateToSentimentDashboard()
                      })
                
                  
                      await test.step("Wait for Dashboard to Load", async () => {
                        await sentiment.verifyDashboardLoadForSingleLocationManager()
                      })
                
                      await test.step("Open Any Trending Up Keywords context Pane", async () => {
                        await sentiment.clickOnTrendingThemes('Trending Up')
                      })
                  
                    });
                
                  })

                  test.describe("View Context Pane for Keywords Trending Down for Single Location Manager @sentimentFE", async () => {
                    test('Validate a context pane shows up for any keyword trending Down - Single Location Manager', async ({ page }) => {
                      await test.step('Login as admin', async () => {
                          await page.goto(`${process.env.LOGIN_URL}`)
                          const login = new Login(page)
                          await login.userLogin('locationManager_2510@uberall.com', process.env.LB_DEFAULT_PASSWORD)
                    
                        })
                        
                        const sentiment = new sentimentDashboardPage(page)
                    
                        await test.step("proceed to Sentiment Dashboard page", async () => {
                          await sentiment.navigateToSentimentDashboard()
                        })
                  
      
                        await test.step("Wait for Dashboard to Load", async () => {
                          await sentiment.verifyDashboardLoadForSingleLocationManager()
                        })
                  
                        await test.step("Open Any Trending Up Keywords context Pane", async () => {
                          await sentiment.clickOnTrendingThemes('Trending Down')
                        })
                    
                      });
                  
                    })

                    test.describe("Verify you can export the sentiment dashboard chart data for Single Location Manager @sentimentFE", async () => {
                      test('Validate you are able to export the sentiment chart data for Single Location Manager', async ({ page }) => {
                        await test.step('Login as admin', async () => {
                            await page.goto(`${process.env.LOGIN_URL}`)
                            const login = new Login(page)
                            await login.userLogin('locationManager_2510@uberall.com', process.env.LB_DEFAULT_PASSWORD)
                      
                          })
                          
                          const sentiment = new sentimentDashboardPage(page)
                      
                          await test.step("proceed to Sentiment Dashboard page", async () => {
                            await sentiment.navigateToSentimentDashboard()
                          })

                    
                          await test.step("Wait for Dashboard to Load", async () => {
                            await sentiment.verifyDashboardLoadForSingleLocationManager()
                          })
                    
                          await test.step("Click on Dashboard Export", async () => {
                            await sentiment.clickOnExportReport()
                          })
                      
                        });
                    
                      })
        
                      test.describe("Verify you can export the context pane feed data for Single Location Manager @sentimentFE", async () => {
                        test('Validate you are able to export the context pane feed data for Single Location Manager', async ({ page }) => {
                          await test.step('Login as admin', async () => {
                              await page.goto(`${process.env.LOGIN_URL}`)
                              const login = new Login(page)
                              await login.userLogin('locationManager_2510@uberall.com', process.env.LB_DEFAULT_PASSWORD)
                        
                            })
                            
                            const sentiment = new sentimentDashboardPage(page)
                        
                            await test.step("proceed to Sentiment Dashboard page", async () => {
                              await sentiment.navigateToSentimentDashboard()
                            })
                
                        
                            await test.step("Wait for Dashboard to Load", async () => {
                              await sentiment.verifyDashboardLoadForSingleLocationManager()
                            })
        
                            await test.step("Open the first location context pane by clicking on its score button", async () => {
                              await sentiment.verifyFirstLocationOnList()
                            })
                      
                            await test.step("Click on Dashboard Export", async () => {
                              await sentiment.clickOnExportFeedReport()
                            })
                        
                          });
                      
                        })


            test.describe("Validate Sentiment Dashboard loads for SP 2510- Multi Location Manager @sentimentFE", async () => {
              test('Sentiment dashboard UI check for Multi Location Manager', async ({ page }) => {
                await test.step('Login as admin', async () => {
                    await page.goto(`${process.env.LOGIN_URL}`)
                    const login = new Login(page)
                    await login.userLogin('multilocation2510@uberall.com', process.env.LB_DEFAULT_PASSWORD)
              
                  })
                  
                  const sentiment = new sentimentDashboardPage(page)
              
                  await test.step("proceed to Sentiment Dashboard page", async () => {
                    await sentiment.navigateToSentimentDashboard()
                  })


                  await test.step("Wait for Dashboard to Load", async () => {
                    await sentiment.verifyDashboardLoad()
                  })
            
                  await test.step("Open Filters", async () => {
                    await sentiment.filtersCheckForMultiLocationManager()
                  })
              
                });
            
              })

              test.describe("View Keywords Modal - Multi Location Manager @sentimentFE", async () => {
                test('View Keywords Modal for Multi Location Manager', async ({ page }) => {
                  await test.step('Login as admin', async () => {
                      await page.goto(`${process.env.LOGIN_URL}`)
                      const login = new Login(page)
                      await login.userLogin('multilocation2510@uberall.com', process.env.LB_DEFAULT_PASSWORD)
                
                    })
                    
                    const sentiment = new sentimentDashboardPage(page)
                
                    await test.step("proceed to Sentiment Dashboard page", async () => {
                      await sentiment.navigateToSentimentDashboard()
                    })
              
                
                    await test.step("Wait for Dashboard to Load", async () => {
                      await sentiment.verifyDashboardLoad()
                    })
              
                    await test.step("Open Keywords Modal", async () => {
                      await sentiment.verifyWordcloudModal()
                    })
                
                  });
              
                })

                test.describe("View Context Pane for Keywords Trending Up for Multi Location Manager @sentimentFE", async () => {
                  test('Validate a context pane shows up for any keyword trending Up for MultiLocation Manager', async ({ page }) => {
                    await test.step('Login as admin', async () => {
                        await page.goto(`${process.env.LOGIN_URL}`)
                        const login = new Login(page)
                        await login.userLogin('multilocation2510@uberall.com', process.env.LB_DEFAULT_PASSWORD)
                  
                      })
                      
                      const sentiment = new sentimentDashboardPage(page)
                  
                      await test.step("proceed to Sentiment Dashboard page", async () => {
                        await sentiment.navigateToSentimentDashboard()
                      })
                
    
                      await test.step("Wait for Dashboard to Load", async () => {
                        await sentiment.verifyDashboardLoad()
                      })
                
                      await test.step("Open Any Trending Up Keywords context Pane", async () => {
                        await sentiment.clickOnTrendingThemes('Trending Up')
                      })
                  
                    });
                
                  })

                  test.describe("View Context Pane for Keywords Trending Down for Multi Location Manager @sentimentFE", async () => {
                    test('Validate a context pane shows up for any keyword trending Down - Multi Location Manager', async ({ page }) => {
                      await test.step('Login as admin', async () => {
                          await page.goto(`${process.env.LOGIN_URL}`)
                          const login = new Login(page)
                          await login.userLogin('multilocation2510@uberall.com', process.env.LB_DEFAULT_PASSWORD)
                    
                        })
                        
                        const sentiment = new sentimentDashboardPage(page)
                    
                        await test.step("proceed to Sentiment Dashboard page", async () => {
                          await sentiment.navigateToSentimentDashboard()
                        })
                  
      
                        await test.step("Wait for Dashboard to Load", async () => {
                          await sentiment.verifyDashboardLoad()
                        })
                  
                        await test.step("Open Any Trending Up Keywords context Pane", async () => {
                          await sentiment.clickOnTrendingThemes('Trending Down')
                        })
                    
                      });
                  
                    })

                    test.describe("Verify you can export the sentiment dashboard chart data for MultiLocation Manager @sentimentFE", async () => {
                      test('Validate you are able to export the sentiment chart data for MultiLocation Manager', async ({ page }) => {
                        await test.step('Login as admin', async () => {
                            await page.goto(`${process.env.LOGIN_URL}`)
                            const login = new Login(page)
                            await login.userLogin('multilocation2510@uberall.com', process.env.LB_DEFAULT_PASSWORD)
                      
                          })
                          
                          const sentiment = new sentimentDashboardPage(page)
                      
                          await test.step("proceed to Sentiment Dashboard page", async () => {
                            await sentiment.navigateToSentimentDashboard()
                          })

                      
                          await test.step("Wait for Dashboard to Load", async () => {
                            await sentiment.verifyDashboardLoad()
                          })
                    
                          await test.step("Click on Dashboard Export", async () => {
                            await sentiment.clickOnExportReport()
                          })
                      
                        });
                    
                      })
        
                      test.describe("Verify you can export the context pane feed data for MultiLocation Manager @sentimentFE", async () => {
                        test('Validate you are able to export the context pane feed data for MultiLocation Manager', async ({ page }) => {
                          await test.step('Login as admin', async () => {
                              await page.goto(`${process.env.LOGIN_URL}`)
                              const login = new Login(page)
                              await login.userLogin('multilocation2510@uberall.com', process.env.LB_DEFAULT_PASSWORD)
                        
                            })
                            
                            const sentiment = new sentimentDashboardPage(page)
                        
                            await test.step("proceed to Sentiment Dashboard page", async () => {
                              await sentiment.navigateToSentimentDashboard()
                            })
                        
                            await test.step("Wait for Dashboard to Load", async () => {
                              await sentiment.verifyDashboardLoad()
                            })
        
                            await test.step("Open the first location context pane by clicking on its score button", async () => {
                              await sentiment.verifyFirstLocationOnList()
                            })
                      
                            await test.step("Click on Dashboard Export", async () => {
                              await sentiment.clickOnExportFeedReport()
                            })
                        
                          });
                      
                        })