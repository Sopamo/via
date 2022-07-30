# Documentation: https://docs.brew.sh/Formula-Cookbook
#                https://rubydoc.brew.sh/Formula
# PLEASE REMOVE ALL GENERATED COMMENTS BEFORE SUBMITTING YOUR PULL REQUEST!
class Via < Formula
  desc "Manage your local dev environments with ease"
  homepage "https://github.com/Sopamo/via"
  url "https://github.com/Sopamo/via/releases/download/v0.4.1/via-apple-arm.tar.gz"
  sha256 "0ebbd70a570b57255ac851a089e91ce7698cb6f16774fb874fd990f1d79547f7"
  license "MIT"

  # depends_on "cmake" => :build

  def install
    # ENV.deparallelize  # if your formula fails when building in parallel
    # Remove unrecognized options if warned by configure
    # https://rubydoc.brew.sh/Formula.html#std_configure_args-instance_method
    # system "./configure", *std_configure_args, "--disable-silent-rules"
    # system "cmake", "-S", ".", "-B", "build", *std_cmake_args	
    system "mkdir", "-p", "#{prefix}/bin"
    system "mv", "./via-apple-arm", "#{prefix}/bin/via"
  end

  test do
    # `test do` will create, run in and delete a temporary directory.
    #
    # This test will fail and we won't accept that! For Homebrew/homebrew-core
    # this will need to be a test that verifies the functionality of the
    # software. Run the test with `brew test via`. Options passed
    # to `brew install` such as `--HEAD` also need to be provided to `brew test`.
    #
    # The installed folder is not in the path, so use the entire path to any
    # executables being tested: `system "#{bin}/program", "do", "something"`.
    system "#{prefix}/bin/via --help"
  end
end
